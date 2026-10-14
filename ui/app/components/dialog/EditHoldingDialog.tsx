import { HoldingType } from '@/network/holdingType';
import HoldingTypePicker from '../inputs/HoldingTypePicker';
import { useEffect, useRef, useState } from 'react';
import Dialog from './Dialog';
import TextListItem from '../inputs/TextLisItem';
import { Holding } from '@/network/account';
import { editHolding, EditHoldingData } from '@/network/holding';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/lib/features/snackbar/snackbarSlice';
import { isEmptyObject } from '@/lib/common/util';

interface EditHoldingDialogProps {
  holding?: Holding;
  open: boolean;
  types: HoldingType[];
  onClose: () => void;
  onUpdate: (data: any) => void;
}

function EditHoldingDialog({
  holding,
  open,
  types,
  onClose,
  onUpdate,
}: EditHoldingDialogProps) {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [typeIds, setTypeIds] = useState<number[]>([]);
  const [shares, setShares] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [historicalDate, setHistoricalDate] = useState('');

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const isMonetary = holding?.isMonetary;

  useEffect(() => {
    if (holding != null) {
      setName(holding.name);
      setTypeIds(holding.types.map((t) => t.id));
      setPrice(holding.price);
      setShares(holding.shares);
      setHistoricalDate('');
    }
  }, [holding]);

  const resetDialog = () => {
    setName(holding?.name ?? '');
    setTypeIds(holding?.types.map((t) => t.id) ?? []);
    setPrice(holding?.price ?? '');
    setShares(holding?.shares ?? '');
    setHistoricalDate('');
  };

  const handleSubmit = async () => {
    const id = holding?.id;
    if (holding == null || id == null) return;

    const sharesValue = shares == '' ? undefined : shares,
      priceValue = price == '' ? undefined : price;

    const validShares = sharesValue && sharesValue > 0,
      validPrice = priceValue && priceValue > 0;

    if (
      (historicalDate ||
        shares !== holding.shares ||
        price !== holding.price) &&
      (!validShares || !validPrice)
    ) {
      return dispatch(addMessage('Please enter a valid price and shares'));
    }

    const data: EditHoldingData = {};
    const originalTypeIds = holding.types.map((t) => t.id);
    if (
      !historicalDate &&
      (typeIds.length !== originalTypeIds.length ||
        typeIds.some((id) => !originalTypeIds.includes(id)))
    ) {
      data.typeIds = typeIds;
    }

    if (!historicalDate && name != holding?.name) {
      data.name = name;
    }
    if ((historicalDate || shares != holding?.shares) && shares !== '') {
      data.shares = shares;
    }
    if ((historicalDate || price != holding?.price) && price !== '') {
      data.price = isMonetary ? 1 : price;
    }
    if (historicalDate) {
      const parsedDate = new Date(historicalDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return dispatch(
          addMessage('Please enter a valid historical date and time.'),
        );
      }
      data.historicalDate = parsedDate.toISOString();
    }

    if (isEmptyObject(data)) {
      return dispatch(addMessage('No data was modified.'));
    }

    try {
      setLoading(true);
      const response = await editHolding(id, data);
      await onUpdate(response);
    } catch (error) {
      dispatch(
        addMessage(
          error instanceof Error ? error.message : 'Unable to update holding.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={`Edit Holding ${holding?.name ?? ''}`}
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={() => {
        handleSubmit();
      }}
      onReset={resetDialog}
      focusInput={nameInputRef?.current}
      containerStyle={{ minWidth: 'min(440px, calc(100vw - 60px))' }}
    >
      <TextListItem
        value={name}
        label="Name"
        disabled={Boolean(historicalDate)}
        onChange={(value: string) => setName(value)}
        type="text"
        containerStyle={{ marginBottom: '12px' }}
        ref={nameInputRef}
      />
      <TextListItem
        value={shares}
        label="Shares"
        onChange={(value: string) => {
          if (value == '') {
            setShares(value);
          } else if (Number(value) > 0) {
            setShares(Number(value));
          }
        }}
        type="number"
        containerStyle={{ marginBottom: '12px' }}
      />

      <TextListItem
        value={price}
        label="Price"
        disabled={isMonetary}
        onChange={(value: string) => {
          if (value == '') {
            setPrice(value);
          } else if (Number(value) > 0) {
            setPrice(Number(value));
          }
        }}
        type="number"
        containerStyle={{ marginBottom: '12px' }}
      />
      <HoldingTypePicker
        types={types}
        selectedIds={typeIds}
        onChange={setTypeIds}
        disabled={loading || Boolean(historicalDate)}
      />
      <TextListItem
        value={historicalDate}
        label="Historical date and time"
        onChange={setHistoricalDate}
        type="datetime-local"
        step="1"
        containerStyle={{ marginBottom: '8px' }}
      />
      <p
        style={{
          color: 'gray',
          fontSize: '0.875rem',
          lineHeight: 1.4,
          margin: '0 0 12px',
        }}
      >
        Optional: Enter a date and time in your local timezone to record
        historical shares and price without updating the current holding. Leave
        blank for a normal update.
      </p>
    </Dialog>
  );
}

export default EditHoldingDialog;

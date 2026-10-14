import { useDispatch } from 'react-redux';
import { addMessage } from '@/lib/features/snackbar/snackbarSlice';
import { HoldingType } from '@/network/holdingType';
import HoldingTypePicker from '../inputs/HoldingTypePicker';
import { useRef, useState } from 'react';
import Dialog from './Dialog';
import TextListItem from '../inputs/TextLisItem';
import { Account, HoldingData, addHoldingsToAccount } from '@/network/account';
import CheckboxListItem from '../inputs/CheckboxListItem';

interface AddHoldingDialogProps {
  account: Account | undefined | null;
  open: boolean;
  types: HoldingType[];
  onClose: () => void;
  onCreate: () => void;
}

function AddHoldingDialog({
  account,
  open,
  types,
  onClose,
  onCreate,
}: AddHoldingDialogProps) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [typeIds, setTypeIds] = useState<number[]>([]);
  const [shares, setShares] = useState(1);
  const [price, setPrice] = useState(1);
  const [monetary, setMonetary] = useState(false);

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const resetDialog = () => {
    setName('');
    setTypeIds([]);
    setMonetary(false);
    setShares(1);
    setPrice(1);
  };

  const handleSubmit = async () => {
    const data: HoldingData = {
      name,
      shares,
      price: monetary ? 1 : price,
      isMonetary: monetary,
      typeIds,
    };

    try {
      const accountId = account?.id;
      if (accountId == null) return;
      setLoading(true);

      await addHoldingsToAccount(accountId, [data]);
      resetDialog();
      onCreate();
    } catch (error) {
      dispatch(
        addMessage(
          error instanceof Error ? error.message : 'Unable to create holding.',
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={'Create Holding'}
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
        onChange={(value: string) => setName(value)}
        type="text"
        containerStyle={{ marginBottom: '12px' }}
        ref={nameInputRef}
      />
      <TextListItem
        value={shares}
        label={monetary ? 'Amount' : 'Shares'}
        onChange={(value: string) => setShares(Number(value))}
        type="number"
        containerStyle={{ marginBottom: '12px' }}
      />
      {!monetary && (
        <TextListItem
          value={price}
          label="Price"
          onChange={(value: string) => setPrice(Number(value))}
          type="number"
          containerStyle={{ marginBottom: '12px' }}
        />
      )}
      <HoldingTypePicker
        types={types}
        selectedIds={typeIds}
        onChange={setTypeIds}
        disabled={loading}
      />
      <CheckboxListItem
        value={monetary}
        label="Monetary"
        onChange={(value: boolean) => setMonetary(value)}
        containerStyle={{ marginBottom: '12px' }}
      />
    </Dialog>
  );
}

export default AddHoldingDialog;

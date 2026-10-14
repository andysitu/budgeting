import { useRef, useState } from 'react';
import {
  HoldingType,
  createHoldingType,
  updateHoldingType,
} from '@/network/holdingType';
import Dialog from './Dialog';
import TextListItem from '../inputs/TextLisItem';

interface Props {
  type: HoldingType | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function HoldingTypeDialog({ type, onClose, onSave }: Props) {
  const [name, setName] = useState(type?.name ?? '');
  const [description, setDescription] = useState(type?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  const save = async () => {
    if (!name.trim()) {
      setError('Enter a type name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = { name: name.trim(), description };
      if (type) await updateHoldingType(type.id, data);
      else await createHoldingType(data);
      await onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save type.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open
      title={type ? 'Edit Holding Type' : 'Add Holding Type'}
      onClose={onClose}
      onSubmit={save}
      loading={loading}
      focusInput={nameRef.current}
      containerStyle={{ minWidth: 'min(440px, calc(100vw - 60px))' }}
    >
      <TextListItem
        label="Name"
        value={name}
        onChange={setName}
        disabled={loading}
        ref={nameRef}
        containerStyle={{ marginBottom: '12px' }}
      />
      <TextListItem
        label="Description"
        value={description}
        onChange={setDescription}
        disabled={loading}
        containerStyle={{ marginBottom: '12px' }}
      />
      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}
    </Dialog>
  );
}

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  HoldingType,
  HoldingTypeListItem,
  deleteHoldingType,
} from '@/network/holdingType';
import ConfirmOrCancel from '../icons/ConfirmOrCancel';
import Table from '../table/Table';
import HoldingTypeDialog from '../dialog/HoldingTypeDialog';

interface Props {
  types: HoldingTypeListItem[];
  onUpdate: () => Promise<void>;
}

export default function HoldingTypes({ types, onUpdate }: Props) {
  const [selectedType, setSelectedType] = useState<
    HoldingType | null | undefined
  >(undefined);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const remove = async (id: number) => {
    setDeleting(true);
    setError('');
    try {
      await deleteHoldingType(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete type.');
    }
    try {
      await onUpdate();
    } catch {
      setError('Unable to refresh holding types.');
    } finally {
      setDeleteId(null);
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="icon"
        aria-label="Add holding type"
        title="Add holding type"
        disabled={deleting}
        onClick={() => setSelectedType(null)}
      >
        <FontAwesomeIcon color="green" icon={faPlus} />
      </button>
      <Table
        columns={[
          { field: 'name', header: 'Name' },
          { field: 'description', header: 'Description' },
          {
            field: '',
            header: 'Action',
            render: (type: HoldingTypeListItem) =>
              deleteId === type.id ? (
                <ConfirmOrCancel
                  onConfirm={() => {
                    if (!deleting && !type.hasHoldings) void remove(type.id);
                  }}
                  onCancel={() => setDeleteId(null)}
                  disabled={deleting || type.hasHoldings}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="icon"
                    aria-label={`Edit ${type.name}`}
                    title="Edit holding type"
                    disabled={deleting}
                    onClick={() => setSelectedType(type)}
                  >
                    <FontAwesomeIcon color="grey" icon={faPen} />
                  </button>
                  <button
                    type="button"
                    className="icon"
                    aria-label={`Delete ${type.name}`}
                    title={
                      type.hasHoldings
                        ? 'Cannot delete: holdings are attached to this type'
                        : 'Delete holding type'
                    }
                    disabled={deleting || type.hasHoldings}
                    onClick={() => {
                      setError('');
                      setDeleteId(type.id);
                    }}
                  >
                    <FontAwesomeIcon color="red" icon={faTrash} />
                  </button>
                </>
              ),
          },
        ]}
        dataList={types}
      />
      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}
      {types.length === 0 && <p>No holding types yet.</p>}
      {selectedType !== undefined && (
        <HoldingTypeDialog
          type={selectedType}
          onClose={() => setSelectedType(undefined)}
          onSave={async () => {
            await onUpdate();
            setSelectedType(undefined);
          }}
        />
      )}
    </>
  );
}

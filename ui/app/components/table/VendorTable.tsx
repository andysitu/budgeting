import { useMount } from '@/lib/common/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { forwardRef, useImperativeHandle, useState } from 'react';
import Table from './Table';
import { deleteVendor, fetchVendors, Vendor } from '@/network/vendor';
import ConfirmOrCancel from '../icons/ConfirmOrCancel';

export type VendorTableHandle = {
  refreshData: () => void;
};

const VendorTable = forwardRef(function VendorTable(props, ref) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<number | null>(null);

  const getVendors = async () => {
    const result = await fetchVendors();

    setVendors(result);
  };

  useImperativeHandle(ref, () => {
    return {
      refreshData: async () => {
        await getVendors();
      },
    };
  });

  useMount(() => {
    getVendors();
  });

  const handleDeleteVendor = async (id: number) => {
    await deleteVendor(id);

    getVendors();
  };

  return (
    <Table
      columns={[
        { field: 'name', header: 'Name', cellStyle: { width: '160px' } },
        {
          field: 'description',
          header: 'Description',
          cellStyle: { width: '300px' },
        },
        {
          field: '',
          header: 'Action',
          cellStyle: { width: '100px' },
          render: ({ id }) => {
            return selectedIdForDelete === id ? (
              <ConfirmOrCancel
                onConfirm={() => {
                  if (id != null) handleDeleteVendor(id);
                }}
                onCancel={() => {
                  setSelectedIdForDelete(null);
                }}
              />
            ) : (
              <button
                className={'icon'}
                onClick={() => {
                  setSelectedIdForDelete(id);
                }}
              >
                <FontAwesomeIcon color="red" icon={faTrash} />
              </button>
            );
          },
        },
      ]}
      dataList={vendors}
    />
  );
});

export default VendorTable;

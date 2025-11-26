import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table from "./Table";
import { deleteVendor, fetchVendors } from "@/network/vendor";
import ConfirmOrCancel from "../icons/ConfirmOrCancel";

export type VendorTableHandle = {
  refreshData: () => void;
};

const VendorTable = forwardRef(function VendorTable(props, ref) {
  const [vendors, setVendors] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

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

  const handleDeleteVendor = async (id: string) => {
    await deleteVendor(id);

    getVendors();
  };

  return (
    <Table
      columns={[
        { field: "name", header: "Name" },
        { field: "description", header: "Description" },
        {
          field: "",
          header: "Action",
          render: ({ id }) => {
            return selectedIdForDelete === id ? (
              <ConfirmOrCancel
                onConfirm={() => {
                  if (id != null) handleDeleteVendor(id);
                }}
                onCancel={() => {
                  setSelectedIdForDelete("");
                }}
              />
            ) : (
              <button
                className={"icon"}
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

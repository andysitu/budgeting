import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table from "./Table";
import { deleteIncome } from "@/network/income";
import { fetchPurchase } from "@/network/purchase";

export type PurchaseTableHandle = {
  refreshData: () => void;
};

const PurchaseTable = forwardRef(function PurchaseTable(props, ref) {
  const [income, setIncome] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [limit, setLimit] = useState(5);

  const getIncome = async () => {
    const result = await fetchPurchase();

    setIncome(result);
  };

  useImperativeHandle(ref, () => {
    return {
      refreshData: async () => {
        await getIncome();
      },
    };
  });

  useMount(() => {
    getIncome();
  });

  const handleDeleteIncome = async (id: string) => {
    await deleteIncome(id);

    getIncome();
  };

  return (
    <Table
      columns={[
        { field: "name", header: "Name" },
        { field: "description", header: "Description" },
        { field: "amount", header: "Amount" },
        {
          field: "date",
          header: "Date",
          render: ({ date }) => {
            return date ? new Date(date).toLocaleString() : "";
          },
        },
        {
          field: "",
          header: "Action",
          render: ({ id }) => {
            return selectedIdForDelete === id ? (
              <div>
                <button
                  className={"icon"}
                  onClick={() => {
                    handleDeleteIncome(id);
                  }}
                >
                  <FontAwesomeIcon color="green" icon={faCheck} />
                </button>
                <button
                  className={"icon"}
                  onClick={() => {
                    setSelectedIdForDelete("");
                  }}
                >
                  <FontAwesomeIcon color="red" icon={faXmark} />
                </button>
              </div>
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
      dataList={income}
    />
  );
});

export default PurchaseTable;

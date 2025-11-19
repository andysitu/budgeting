import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { deletePurchase, fetchPurchase } from "@/network/purchase";
import { Expense } from "@/network/expense";

export type PurchaseTableHandle = {
  refreshData: () => void;
};

const PurchaseTable = forwardRef(function PurchaseTable(props, ref) {
  const [purchases, setPurchases] = useState<Expense[]>([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<
    number | null | undefined
  >(null);

  const [limit, setLimit] = useState(5);

  const getIncome = async () => {
    const result = await fetchPurchase();

    setPurchases(result);
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

  const handleDeletePurchase = async (id: number) => {
    await deletePurchase(id);

    getIncome();
  };

  const getColumns = (): Columns<Expense>[] => {
    return [
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
                  if (id != null) handleDeletePurchase(id);
                }}
              >
                <FontAwesomeIcon color="green" icon={faCheck} />
              </button>
              <button
                className={"icon"}
                onClick={() => {
                  setSelectedIdForDelete(null);
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
    ];
  };

  return <Table columns={getColumns()} dataList={purchases} />;
});

export default PurchaseTable;

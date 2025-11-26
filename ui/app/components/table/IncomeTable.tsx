import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { deleteIncome, fetchIncome, Income } from "@/network/income";
import ConfirmOrCancel from "../icons/ConfirmOrCancel";

export type IncomeTableHandle = {
  refreshData: () => void;
};

const IncomeTable = forwardRef(function IncomeTable(props, ref) {
  const [income, setIncome] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<null | number>(
    null
  );

  const getIncome = async () => {
    const result = await fetchIncome();

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

  const handleDeleteIncome = async (id: number) => {
    await deleteIncome(id);

    getIncome();
  };

  const getColumns = (): Columns<Income>[] => {
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
        field: "vendor",
        header: "Vendor",
        render: ({ vendor }) => {
          return vendor?.name ?? "";
        },
      },
      {
        field: "",
        header: "Action",
        render: ({ id }) => {
          return selectedIdForDelete === id ? (
            <ConfirmOrCancel
              onConfirm={() => {
                if (id != null) handleDeleteIncome(id);
              }}
              onCancel={() => {
                setSelectedIdForDelete(null);
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
    ];
  };

  return <Table columns={getColumns()} dataList={income} />;
});

export default IncomeTable;

import { useMount } from "@/lib/common/util";
import { deleteExpense, Expense, fetchExpenses } from "@/network/expense";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import ConfirmOrCancel from "../icons/ConfirmOrCancel";

export type ExpenseTableHandle = {
  refreshData: () => void;
};

const ExpenseTable = forwardRef(function ExpenseTable(props, ref) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState<
    number | null | undefined
  >(null);

  const getExpenses = async () => {
    const expenses = await fetchExpenses();

    setExpenses(expenses);
  };

  useImperativeHandle(ref, () => {
    return {
      refreshData: async () => {
        await getExpenses();
      },
    };
  });

  useMount(() => {
    getExpenses();
  });

  const handleDeleteExpense = async (id: number) => {
    await deleteExpense(id);

    getExpenses();
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
                if (id != null) handleDeleteExpense(id);
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

  return <Table columns={getColumns()} dataList={expenses} />;
});

export default ExpenseTable;

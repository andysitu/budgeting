import { useMount } from "@/lib/common/util";
import { deleteExpense, fetchExpenses } from "@/network/expense";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table from "./Table";

export type ExpenseTableHandle = {
  refreshData: () => void;
};

const ExpenseTable = forwardRef(function ExpenseTable(props, ref) {
  const [expenses, setExpenses] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

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

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);

    getExpenses();
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
                    handleDeleteExpense(id);
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
      dataList={expenses}
    />
  );
});

export default ExpenseTable;

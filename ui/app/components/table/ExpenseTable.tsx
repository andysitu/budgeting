import { useMount } from "@/lib/common/util";
import { deleteExpense, fetchExpenses } from "@/network/expense";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";

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
  };

  const renderExpenses = () => {
    if (!(expenses?.length > 0)) {
      return null;
    }

    const expenseList = [];

    for (let i = 0; i < expenses.length; i++) {
      const { id, name, description, amount } = expenses[i];

      expenseList.push(
        <tr key={`expense-row-${id}`}>
          <td>{name}</td>
          <td>{description}</td>
          <td>{amount}</td>
          <td>
            {selectedIdForDelete === id ? (
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
            )}
          </td>
        </tr>
      );
    }

    return expenseList;
  };

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Amount</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>{renderExpenses()}</tbody>
    </table>
  );
});

export default ExpenseTable;

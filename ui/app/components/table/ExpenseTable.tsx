import { useMount } from "@/lib/common/util";
import { fetchExpenses } from "@/network/expense";
import { useState } from "react";

function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    const expenses = await fetchExpenses();

    setExpenses(expenses);
  };

  useMount(() => {
    getExpenses();
  });

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
        </tr>
      </thead>
      <tbody>{renderExpenses()}</tbody>
    </table>
  );
}

export default ExpenseTable;

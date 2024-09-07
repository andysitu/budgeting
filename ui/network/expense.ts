import { getConfiguration } from "./util";

type Expense = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchExpenses = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/expenses", requestParam);

  return result.json();
};

const createExpense = async (expense: Expense) => {
  const requestParam = getConfiguration("POST");

  const result = await fetch("/api/expenses", {
    body: JSON.stringify(expense),
    ...requestParam,
  });

  return result;
};

const deleteExpense = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/expenses/${id}`, requestParam);

  return result;
};

export { fetchExpenses, createExpense, deleteExpense };

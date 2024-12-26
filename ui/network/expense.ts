import { ExpenseData } from "@/app/components/dialog/AddExpenseDialog";
import { getConfiguration, sendFetch } from "./util";

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

const createExpense = async (expense: Expense): Promise<ExpenseData> => {
  return sendFetch("POST", { body: JSON.stringify(expense) });
};

const deleteExpense = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/expenses/${id}`, requestParam);

  return result;
};

export { fetchExpenses, createExpense, deleteExpense };

import { ExpenseData } from "@/app/components/dialog/AddExpenseDialog";
import { sendRequest } from "./util";

type Expense = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchExpenses = async (params: Record<string, any> = {}) => {
  const result = await sendRequest("/api/expenses", "GET", params);

  return result;
};

const createExpense = async (expense: Expense): Promise<ExpenseData> => {
  const result = await sendRequest("/api/income", "POST", {
    body: JSON.stringify(expense),
  });

  return result;
};

const deleteExpense = async (id: string) => {
  const result = await sendRequest(`/api/expenses/${id}`, "DELETE");
  return result;
};

export { fetchExpenses, createExpense, deleteExpense };

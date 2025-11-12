import { ExpenseData } from "@/app/components/dialog/AddExpenseDialog";
import { getConfiguration, sendFetch } from "./util";
import { isEmptyObject } from "@/lib/common/util";

type Expense = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchExpenses = async (params: Record<string, any> = {}) => {
  const requestParam = getConfiguration("GET");

  const url = new URL("/api/expenses", window.location.origin);

  if (!isEmptyObject(params)) {
    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }
  }
  const result = await fetch(url, requestParam);

  return result.json();
};

const createExpense = async (expense: Expense): Promise<ExpenseData> => {
  const requestParam = getConfiguration("POST");

  const result = await fetch("/api/income", {
    body: JSON.stringify(expense),
    ...requestParam,
  });

  return result.json();
};

const deleteExpense = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/expenses/${id}`, requestParam);

  return result;
};

export { fetchExpenses, createExpense, deleteExpense };

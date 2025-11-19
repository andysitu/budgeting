import { VendorData } from "@/app/components/dialog/AddVendorDialog";
import { sendRequest } from "./util";
import { ExpenseData } from "@/app/components/dialog/AddExpenseDialog";

export type Expense = {
  id?: number;
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  vendorId?: number | undefined;
  vendor?: VendorData;
};

const fetchExpenses = async (
  params: Record<string, any> = {}
): Promise<Expense[]> => {
  const result = await sendRequest("/api/expenses", "GET", params);

  return result;
};

const createExpense = async (expense: ExpenseData): Promise<Expense> => {
  const result = await sendRequest("/api/income", "POST", {
    body: JSON.stringify(expense),
  });

  return result;
};

const deleteExpense = async (id: number) => {
  const result = await sendRequest(`/api/expenses/${id}`, "DELETE");
  return result;
};

export { fetchExpenses, createExpense, deleteExpense };

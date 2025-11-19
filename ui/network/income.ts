import { IncomeData } from "@/app/components/dialog/AddIncomeDialog";
import { sendRequest } from "./util";
import { VendorData } from "@/app/components/dialog/AddVendorDialog";

export type Income = {
  id: number;
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
  vendor?: VendorData;
};

const fetchIncome = async () => {
  const result = await sendRequest("/api/income", "GET");

  return result;
};

const deleteIncome = async (id: number) => {
  const result = await sendRequest(`/api/income/${id}`, "DELETE");
  return result;
};

const createIncome = async (income: Income): Promise<IncomeData> => {
  const result = await sendRequest("/api/income", "POST", {
    body: JSON.stringify(income),
  });
  return result;
};
export { fetchIncome, deleteIncome, createIncome };

import { IncomeData } from "@/app/components/dialog/AddIncomeDialog";
import { sendRequest } from "./util";

type Income = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchIncome = async () => {
  const result = await sendRequest("/api/income", "GET");

  return result;
};

const deleteIncome = async (id: string) => {
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

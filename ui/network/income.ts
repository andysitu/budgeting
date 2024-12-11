import { IncomeData } from "@/app/components/dialog/AddIncomeDialog";
import { getConfiguration } from "./util";
import { sendFetch } from "@/lib/common/util";

type Income = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchIncome = async (parameters?: Record<string, any>) => {
  const requestParam = getConfiguration("GET");

  const result = await sendFetch("/api/income", requestParam);

  return result.json();
};

const deleteIncome = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await sendFetch(`/api/income/${id}`, requestParam);

  return result;
};

const createIncome = async (income: Income): Promise<IncomeData> => {
  const requestParam = getConfiguration("POST");

  const result = await sendFetch("/api/income", {
    body: JSON.stringify(income),
    ...requestParam,
  });

  return result.json();
};

export { fetchIncome, deleteIncome, createIncome };

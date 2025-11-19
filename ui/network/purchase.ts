import { sendRequest } from "./util";
import { Expense } from "./expense";

const fetchPurchase = async (): Promise<Expense[]> => {
  const result = await sendRequest("/api/expenses?type=purchase", "GET");
  return result;
};

const deletePurchase = async (id: number) => {
  const result = await sendRequest(`/api/purchases/${id}`, "DELETE");
  return result;
};

export { fetchPurchase, deletePurchase };

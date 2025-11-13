import { sendRequest } from "./util";

const fetchPurchase = async () => {
  const result = await sendRequest("/api/expenses?type=purchase", "GET");
  return result;
};

const deletePurchase = async (id: string) => {
  const result = await sendRequest(`/api/purchases/${id}`, "DELETE");
  return result;
};

export { fetchPurchase, deletePurchase };

import { sendRequest } from "./util";

const deleteTransaction = async (id: number) => {
  return sendRequest(`api/transactions/${id}`, "DELETE");
};

export { deleteTransaction };

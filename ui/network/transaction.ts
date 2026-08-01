import { sendRequest } from "./util";

const setTransactionInactive = async (id: number) => {
  return sendRequest(`api/transactions/${id}`, "DELETE");
};

const setTransactionActive = async (id: number) => {
  return sendRequest(`api/transactions/${id}`, "POST");
};

export { setTransactionInactive, setTransactionActive };

import { sendRequest } from "./util";

export type Account = {
  id: number;
  name: string;
  description: string;
};

export type AccountData = {
  name: string;
  description: string;
};

const fetchAccounts = async (
  params: Record<string, any> = {}
): Promise<Account[]> => {
  const result = await sendRequest("/api/accounts", "GET", params);

  return result;
};

const createAccount = async (account: AccountData) => {
  const result = await sendRequest("/api/accounts", "POST", {
    body: JSON.stringify(account),
  });
  return result;
};

export { fetchAccounts, createAccount };

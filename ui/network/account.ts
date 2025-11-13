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
  const url = new URL("/api/accounts", window.location.origin);
  const result = await sendRequest(url, "GET", params);

  return result;
};

const createAccount = async (account: AccountData) => {
  const result = await sendRequest("/api/accounts", "POST", {
    body: JSON.stringify(account),
  });

  return result;
};

export { fetchAccounts, createAccount };

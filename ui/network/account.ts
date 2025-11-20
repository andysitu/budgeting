import { sendRequest } from "./util";

export type Holding = {
  id: number;
  name: string;
  shares: number;
  price: number;
};

export type Account = {
  id: number;
  name: string;
  description: string;
  holdings: Holding[];
};

export type AccountData = {
  name: string;
  description: string;
};

export type HoldingData = {
  name: string;
  shares: number;
  price: number;
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

const addHoldingsToAccount = async (
  accountId: number,
  holdings: HoldingData[]
) => {
  const result = await sendRequest(
    `api/accounts/${accountId}/holdings`,
    "POST",
    {
      body: JSON.stringify({
        holdings,
      }),
    }
  );
};

export { fetchAccounts, createAccount, addHoldingsToAccount };

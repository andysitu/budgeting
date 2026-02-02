import { sendRequest } from "./util";

export interface Holding {
  id: number;
  name: string;
  shares: number;
  price: number;
  isMonetary: boolean;
}

export interface Account {
  id: number;
  name: string;
  description: string;
  holdings: Holding[];
}

export interface AccountData {
  name: string;
  description: string;
}

export interface HoldingData {
  name: string;
  shares: number;
  price: number;
  isMonetary: boolean;
}

export interface BaseTransaction {
  id: number;
  name: string;
  description: string;
  modified_holding: boolean;
  date: Date;
}

export interface BaseHoldingTransaction {
  id: number;
  shares: number;
  price: number;
  holding: Holding;
}

export interface HoldingTransaction extends BaseHoldingTransaction {
  source_transaction?: BaseTransaction;
  destination_transaction?: BaseTransaction;
}

export interface Transaction extends BaseTransaction {
  from_holding_transaction?: BaseHoldingTransaction;
  to_holding_transaction: BaseHoldingTransaction;
}

const fetchAccounts = async (
  params: Record<string, any> = {},
): Promise<Account[]> => {
  return sendRequest("/api/accounts", "GET", params);
};

const createAccount = async (account: AccountData) => {
  return sendRequest("/api/accounts", "POST", {
    body: JSON.stringify(account),
  });
};

const addHoldingsToAccount = async (
  accountId: number,
  holdings: HoldingData[],
) => {
  return sendRequest(`api/accounts/${accountId}/holdings`, "POST", {
    body: JSON.stringify({
      holdings,
    }),
  });
};

const deleteHolding = async (accountId: number, holdingId: number) => {
  if (!holdingId || !accountId) {
    throw new Error("Holding or account id not provided to delete holding");
  }
  return sendRequest(
    `api/accounts/${accountId}/holdings/${holdingId}`,
    "DELETE",
  );
};

const transferHolding = async (
  fromHoldinId: number,
  toholdingId: number,
  fromShares: number,
  toShares: number,
) => {
  return sendRequest("/api/holdings/transfer", "POST", {
    body: JSON.stringify({
      from_holding_id: fromHoldinId,
      to_holding_id: toholdingId,
      from_shares: fromShares,
      to_shares: toShares,
    }),
  });
};

const fetchHoldingTransactions = async (
  holdingId: number,
): Promise<HoldingTransaction[]> => {
  if (!holdingId) {
    throw new Error("Holding id is not provided for holding transactions");
  }
  return sendRequest(`api/holdings/${holdingId}/transactions`, "GET");
};

const fetchTransactions = async (
  holdingId?: number,
): Promise<Transaction[]> => {
  const params: Record<string, any> = {};
  if (holdingId) {
    params.holdingId = holdingId;
  }
  return sendRequest(`api/transactions`, "GET", params);
};

export {
  fetchAccounts,
  createAccount,
  addHoldingsToAccount,
  deleteHolding,
  transferHolding,
  fetchTransactions,
  fetchHoldingTransactions,
};

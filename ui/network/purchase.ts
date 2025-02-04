import { getConfiguration } from "./util";

type Purchse = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

export type PurchaseData = {
  name: string;
  description: string;
  amount: number;
  date?: Date;
};

const fetchPurchase = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/purchases", requestParam);

  return result?.json() ?? [];
};

const deletePurchase = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/purchases/${id}`, requestParam);

  return result;
};

const createPurchase = async (purchase: Purchse): Promise<PurchaseData> => {
  const requestParam = getConfiguration("POST");

  const result = await fetch("/api/purchases", {
    body: JSON.stringify(purchase),
    ...requestParam,
  });

  return result.json();
};

export { fetchPurchase, deletePurchase, createPurchase };

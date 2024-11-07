import { getConfiguration } from "./util";

type Purchse = {
  name: string;
  description?: string;
  amount: number;
  date?: Date;
  startDate?: Date;
  endDate?: Date;
};

const fetchPurchase = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/purchase", requestParam);

  return result.json();
};

export { fetchPurchase };

import { sendRequest } from "./util";

export interface AddToHolding {
  id: number;
  name?: string;
  description?: string;
  amount?: number;
  shares?: number;
  modifyHolding?: boolean;
}

const addToHolding = async (addToHoldingData: AddToHolding) => {
  if (
    (addToHoldingData.amount == null || !(addToHoldingData.amount > 0)) &&
    (addToHoldingData.shares == null || !(addToHoldingData.shares > 0))
  ) {
    throw new Error("Invalid amounts provided to addToHolding");
  } else if (!(addToHoldingData.id > 0)) {
    throw new Error("Invalid id provided to addToHolding");
  }

  const holdingData = {
    shares: addToHoldingData.shares,
    amount: addToHoldingData.amount,
    name: addToHoldingData.name,
    description: addToHoldingData.description,
    modify: addToHoldingData.modifyHolding,
  };

  return sendRequest(`api/holdings/${addToHoldingData.id}/add`, "POST", {
    body: JSON.stringify(holdingData),
  });
};

export { addToHolding };

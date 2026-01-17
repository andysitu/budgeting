import { isEmptyObject } from "@/lib/common/util";
import {
  fetchHoldingTransactions,
  HoldingTransaction,
} from "@/network/account";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface TransactionViewProps {
  holdingId: number | null;
  onClose: () => void;
}

function TransactionView({ holdingId, onClose }: TransactionViewProps) {
  const [holdingTranactions, setHoldingTransactions] = useState<
    HoldingTransaction[]
  >([]);

  const getHoldingTransactions = async (holdingId: number) => {
    const result = await fetchHoldingTransactions(holdingId);
    console.log("result", result);
    setHoldingTransactions(result);
  };

  useEffect(() => {
    if (!holdingId) return;

    getHoldingTransactions(holdingId);
  }, [holdingId]);

  if (holdingId == null) return "";

  const showTransactions = () => {
    if (holdingTranactions.length == 0) {
      return <div>There are no Transactions</div>;
    }
    const transactions = [];

    for (const ht of holdingTranactions) {
      //
    }

    return <div></div>;
  };

  return (
    <div
      style={{
        overflow: "auto",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        paddingLeft: "14px",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>Transactions</div>
        <button
          className={"icon"}
          onClick={() => {
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      {showTransactions()}
    </div>
  );
}

export default TransactionView;

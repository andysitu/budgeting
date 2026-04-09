import { fetchTransactions, Holding, Transaction } from "@/network/account";
import { deleteTransaction } from "@/network/transaction";
import { faArrowRight, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface TransactionViewProps {
  holding: Holding | null;
  onClose: () => void;
}

function TransactionView({ holding, onClose }: TransactionViewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const rightLeftPadding = "14px";

  const getHoldingTransactions = async (holdingId: number) => {
    setLoading(true);
    try {
      const transactions = (await fetchTransactions(holdingId)) ?? [];
      setTransactions(transactions);
    } catch (error) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!holding) return;
    const holdingId = holding.id;

    getHoldingTransactions(holdingId);
  }, [holding]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        Loading...
      </div>
    );
  } else if (holding == null) return "";

  const showTransactions = (active: boolean) => {
    if (active && transactions.length == 0) {
      return <div>There are no Transactions</div>;
    }

    const filteredTransactions = transactions.filter((t) => t.active == active);

    if (!active && filteredTransactions.length == 0) {
      return null;
    }

    const transactionElements = [];
    for (const t of filteredTransactions) {
      const {
        id,
        name,
        description,
        from_holding_transaction,
        to_holding_transaction,
        date,
      } = t;

      const d = new Date(date);

      const transactionRow = [];

      if (from_holding_transaction) {
        const { shares, price, holding } = from_holding_transaction;
        const { name, id: holdingId } = holding;
        transactionRow.push(
          <div key={`from_holding_${id}_${holdingId}`} style={{ flex: 1 }}>
            <div>{`${holding.name ? holding.name : "-"}`}</div>
            <div>{`Shares: ${shares} | Price: ${price} | Total: ${shares * price}`}</div>
          </div>,
        );
      } else {
        transactionRow.push(
          <div key={`from_holding_${id}_none`} style={{ flex: 1 }}>
            -
          </div>,
        );
      }

      transactionRow.push(
        <div key={`transaction_arrow_${id}`} style={{ paddingInline: 20 }}>
          <FontAwesomeIcon icon={faArrowRight} />
        </div>,
      );

      if (to_holding_transaction) {
        const { shares, price, holding } = to_holding_transaction;
        const { name, id: holdingId } = holding;
        transactionRow.push(
          <div key={`to_holding_${id}_${holdingId}`} style={{ flex: 1 }}>
            <div>{`${holding.name ? holding.name : "-"}`}</div>
            <div>{`Shares: ${shares} | Price: ${price} | Total: ${shares * price}`}</div>
          </div>,
        );
      } else {
        transactionRow.push(
          <div key={`to_holding_${id}_none`} style={{ flex: 1 }}>
            -
          </div>,
        );
      }

      const transactionBody = (
        <div key={`transaction-list-${id}`}>
          <div>{`${d.toLocaleString()}`}</div>
          <div
            style={{
              paddingBottom: "8px",
              marginBottom: "8px",
              borderBottom: "1px solid lightgray",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {transactionRow}
            {active && (
              <button
                className="icon"
                onClick={async () => {
                  const result = await deleteTransaction(id);
                  console.log("result", result);
                }}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            )}
          </div>
        </div>
      );

      transactionElements.push(transactionBody);
    }

    return (
      <div style={{ marginRight: rightLeftPadding }}>{transactionElements}</div>
    );
  };

  const inactiveRows = showTransactions(false);

  return (
    <div
      style={{
        overflow: "auto",
        border: "1px solid black",
        borderRadius: "5px",
        padding: "5px",
        paddingLeft: rightLeftPadding,
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
        <div style={{ fontWeight: "bold" }}>{`Transactions${
          holding != null ? ` for ${holding.name ? holding.name : "-"}` : ""
        }`}</div>
        <button
          className={"icon"}
          onClick={() => {
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>
      {showTransactions(true)}

      {inactiveRows && (
        <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
          <div style={{ fontWeight: "bold" }}>Inactive Transactions</div>
          {inactiveRows}
        </div>
      )}
    </div>
  );
}

export default TransactionView;

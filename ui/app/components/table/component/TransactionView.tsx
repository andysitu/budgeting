import {
  fetchHoldingHistory,
  fetchTransactions,
  Holding,
  HoldingHistory,
  Transaction,
} from '@/network/account';
import {
  setTransactionActive,
  setTransactionInactive,
} from '@/network/transaction';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRight,
  faCircleCheck,
  faClose,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Tabs from '../../tabs';

interface TransactionViewProps {
  holding: Holding | null;
  onClose: () => void;
  onUpdate: () => void;
}

function TransactionView({ holding, onClose, onUpdate }: TransactionViewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [holdingHistory, setHoldingHistory] = useState<HoldingHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const rightLeftPadding = '14px';

  const getHoldingActivity = async (holdingId: number) => {
    setLoading(true);
    try {
      const [transactions, history] = await Promise.all([
        fetchTransactions(holdingId),
        fetchHoldingHistory(holdingId),
      ]);
      setTransactions(transactions);
      setHoldingHistory(history);
    } catch (error) {
      setTransactions([]);
      setHoldingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!holding) return;
    const holdingId = holding.id;

    getHoldingActivity(holdingId);
  }, [holding]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  } else if (holding == null) return '';

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
            <div>{`${holding.name ? holding.name : '-'}`}</div>
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
            <div>{`${holding.name ? holding.name : '-'}`}</div>
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
              paddingBottom: '8px',
              marginBottom: '8px',
              borderBottom: '1px solid lightgray',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {transactionRow}
            {
              <button
                className="icon"
                onClick={async () => {
                  if (active) {
                    await setTransactionInactive(id);
                  } else {
                    await setTransactionActive(id);
                  }
                  onUpdate();
                }}
              >
                {active ? (
                  <FontAwesomeIcon icon={faCircleCheck} />
                ) : (
                  <FontAwesomeIcon icon={faCircle} />
                )}
              </button>
            }
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

  const historyRows = holdingHistory.map((history) => {
    const oldTotal = history.old_shares * history.old_price;
    const newTotal = history.new_shares * history.new_price;

    return (
      <div
        key={`holding-history-${history.id}`}
        style={{
          paddingBottom: '8px',
          marginBottom: '8px',
          borderBottom: '1px solid lightgray',
        }}
      >
        <div>
          {new Date(history.date).toLocaleString()}
          {history.is_historical ? ' (historical entry)' : ''}
        </div>
        <div>{`Shares: ${history.old_shares} to ${history.new_shares}`}</div>
        <div>{`Price: ${history.old_price} to ${history.new_price}`}</div>
        <div>{`Total: ${oldTotal} to ${newTotal}`}</div>
      </div>
    );
  });

  return (
    <div
      style={{
        overflow: 'auto',
        border: '1px solid black',
        borderRadius: '5px',
        padding: '5px',
        paddingLeft: rightLeftPadding,
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{`Transactions${
          holding != null ? ` for ${holding.name ? holding.name : '-'}` : ''
        }`}</div>
        <button
          className={'icon'}
          onClick={() => {
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
      </div>

      <Tabs
        elements={{
          Transactions: (
            <div>
              {showTransactions(true)}

              {inactiveRows && (
                <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>
                    Inactive Transactions
                  </div>
                  {inactiveRows}
                </div>
              )}
            </div>
          ),
          'Historical Data': (
            <div style={{ paddingTop: '10px', marginRight: rightLeftPadding }}>
              <div style={{ fontWeight: 'bold', paddingBottom: '8px' }}>
                Historical Data
              </div>
              {historyRows.length > 0 ? (
                historyRows
              ) : (
                <div>There is no historical data</div>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
}

export default TransactionView;

import {
  Account,
  deleteHolding,
  fetchAccounts,
  Holding,
} from "@/network/account";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import AddHoldingDialog from "../dialog/AddHoldingDialog";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import ConfirmOrCancel from "../icons/ConfirmOrCancel";
import { useDispatch } from "react-redux";
import { addMessage } from "@/lib/features/snackbar/snackbarSlice";
import { useMount } from "@/lib/common/util";
import AddAccountDialog from "../dialog/AddAccountDialog";

export type AccountTableHandle = {};

interface AccountTableProps {
  onUpdate?: () => void;
}

const AccountsTable = forwardRef(function AccountsTable(
  { onUpdate }: AccountTableProps,
  ref
) {
  const dispatch = useDispatch();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [accountForAddHolding, setAccountForAddHolding] = useState<
    undefined | Account | null
  >(null);
  const [selectHoldingForDelete, setSelectHoldingForDelete] = useState<
    null | number
  >(null);

  const getAccounts = async () => {
    const result = await fetchAccounts();
    console.log(result);
    setAccounts(result);
  };

  useMount(() => {
    getAccounts();
  });

  useImperativeHandle(ref, () => {
    return {};
  });

  const toggleTransferHoldings = () => {
    // check if there are enough accounts / holdings first

    if (!(accounts.length > 0)) {
      return dispatch(
        addMessage("There are no accounts created. Please create an account.")
      );
    }

    let totalHoldings = 0;
    for (const account of accounts) {
      const holdings = account.holdings;
      const numHoldings = holdings?.length ?? 0;
      totalHoldings += numHoldings;
      if (totalHoldings >= 2) break;
    }
    if (!(totalHoldings >= 2)) {
      return dispatch(
        addMessage(
          "There must be at least 2 holdings total in all the accounts."
        )
      );
    }
  };

  const getColumns = (): Columns<Account>[] => {
    return [
      {
        field: "name",
        header: "Name",
        cellStyle: { width: 100 },
      },
      { field: "description", header: "Description" },
      {
        field: "",
        header: "",
        render: (acct) => {
          return (
            <div>
              <button
                className="icon"
                onClick={() => {
                  const id = acct.id;
                  const account = accounts.find((a) => a.id == Number(id));
                  setAccountForAddHolding(account);
                }}
              >
                <FontAwesomeIcon color="green" icon={faPlus} />
              </button>
            </div>
          );
        },
      },
    ];
  };

  const findAccountIdByHolding = (holdingId: number): number | undefined => {
    let accountId = null;
    for (const account of accounts) {
      const holdings = account.holdings;
      for (const h of holdings) {
        if (h.id == holdingId) {
          return account.id;
        }
      }
    }
  };

  const confirmDeleteHolding = async (holdingId: number) => {
    // find account of the holding
    const accountId = findAccountIdByHolding(holdingId);
    if (accountId != null) {
      await deleteHolding(accountId, holdingId);
      if (onUpdate) onUpdate();
    }
  };

  const getHoldingColumns = (): Columns<Holding>[] => {
    return [
      {
        field: "name",
        header: "Name",
        cellStyle: { width: 100 },
      },
      { field: "price", header: "Price" },
      { field: "shares", header: "Shares" },
      {
        field: "",
        header: "Total",
        render: (holding) => String(holding.price * holding.shares),
      },
      {
        field: "",
        header: "",
        render: (holding) => {
          if (toggledTransfer) return "";
          const id = holding.id;
          if (selectHoldingForDelete == id) {
            return (
              <div>
                <ConfirmOrCancel
                  onConfirm={() => {
                    confirmDeleteHolding(id);
                  }}
                  onCancel={() => {
                    setSelectHoldingForDelete(null);
                  }}
                />
              </div>
            );
          }
          return (
            <div>
              <button
                className="icon"
                onClick={() => {
                  setSelectHoldingForDelete(id);
                }}
              >
                <FontAwesomeIcon color="red" icon={faTrashCan} />
              </button>
            </div>
          );
        },
      },
    ];
  };

  const renderInnerHoldingsTable = (account: Account) => {
    console.log(account);
    const holdings = account.holdings;
    return (
      <div style={{ border: "1px solid lightgray" }}>
        <Table columns={getHoldingColumns()} dataList={holdings} />
      </div>
    );
  };

  return (
    <>
      <button
        className="icon"
        onClick={() => {
          setAddDialogOpen(true);
        }}
      >
        <FontAwesomeIcon color="green" icon={faPlus} />
      </button>
      <button
        className="icon"
        onClick={() => {
          toggleTransferHoldings();
        }}
      >
        <FontAwesomeIcon icon={faRightLeft} />
      </button>
      <Table
        columns={getColumns()}
        dataList={accounts}
        renderInnerTable={renderInnerHoldingsTable}
      />
      <AddHoldingDialog
        open={accountForAddHolding != null}
        account={accountForAddHolding}
        onClose={() => {
          setAccountForAddHolding(null);
        }}
        onCreate={() => {
          if (onUpdate) onUpdate();
        }}
      />
      <AddAccountDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
        }}
        onCreate={async () => {
          await getAccounts();
        }}
      />
    </>
  );
});

export default AccountsTable;

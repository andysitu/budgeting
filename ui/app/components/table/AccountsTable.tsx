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

  const [toggledTransfer, setToggledTransfer] = useState<boolean>(false);
  const [selectedIdFromTransfer, setSelectedIdFromTransfer] = useState<
    number | null
  >(null);
  const [selectedIdToTransfer, setSelectedIdToTransfer] = useState<
    number | null
  >(null);

  const getAccounts = async () => {
    const result = await fetchAccounts();
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
    setToggledTransfer(true);
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
    for (const account of accounts) {
      const holdings = account.holdings;
      for (const h of holdings) {
        if (h.id == holdingId) {
          return account.id;
        }
      }
    }
  };
  const findHoldingById = (holdingId: number): Holding | undefined => {
    for (const account of accounts) {
      const holdings = account.holdings;
      for (const h of holdings) {
        if (h.id == holdingId) {
          return h;
        }
      }
    }
  };

  const confirmDeleteHolding = async (holdingId: number) => {
    // find account of the holding
    const accountId = findAccountIdByHolding(holdingId);
    if (accountId != null) {
      await deleteHolding(accountId, holdingId);
      await getAccounts();
      if (onUpdate) onUpdate();
    }
  };

  const getHoldingColumns = (): Columns<Holding>[] => {
    const columns: Columns<Holding>[] = [
      {
        field: "name",
        header: "Name",
        cellStyle: { width: 100 },
      },
      { field: "price", header: "Price", cellStyle: { width: "70px" } },
      { field: "shares", header: "Shares", cellStyle: { width: "70px" } },
      {
        field: "",
        header: "Total",
        render: (holding: Holding) => String(holding.price * holding.shares),
        cellStyle: { width: "70px" },
      },
      {
        field: "",
        header: "",
        render: (holding: Holding) => {
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

    if (toggledTransfer) {
      columns.unshift(
        {
          field: "",
          header: "From",
          render: (holding: Holding) => {
            const id = holding.id;
            return (
              <input
                type="checkbox"
                disabled={id === selectedIdToTransfer}
                checked={id === selectedIdFromTransfer}
                onChange={() => {
                  if (id === selectedIdFromTransfer) {
                    setSelectedIdFromTransfer(null);
                  } else {
                    setSelectedIdFromTransfer(id);
                  }
                }}
              />
            );
          },
          cellStyle: { width: "50px" },
        },
        {
          field: "",
          header: "To",
          render: (holding: Holding) => {
            const id = holding.id;
            return (
              <input
                type="checkbox"
                disabled={id === selectedIdFromTransfer}
                checked={id === selectedIdToTransfer}
                onChange={() => {
                  if (id === selectedIdToTransfer) {
                    setSelectedIdToTransfer(null);
                  } else {
                    setSelectedIdToTransfer(id);
                  }
                }}
              />
            );
          },
          cellStyle: { width: "50px" },
        }
      );
    }

    return columns;
  };

  const renderInnerHoldingsTable = (account: Account) => {
    const holdings = account.holdings;
    return (
      <div style={{ border: "1px solid lightgray" }}>
        <Table columns={getHoldingColumns()} dataList={holdings} />
      </div>
    );
  };

  const renderTopButtons = () => {
    if (toggledTransfer) {
      const transferId = "transfer-input";

      const toAndFromSelected =
        selectedIdFromTransfer != null && selectedIdToTransfer != null;
      let placeholder = "";
      if (toAndFromSelected) {
        const fromHolding = findHoldingById(selectedIdFromTransfer);
        if (fromHolding) {
          placeholder = `Max ${fromHolding.shares} Shares`;
        }
      }

      return (
        <div style={{ display: "flex", textAlign: "center" }}>
          <label htmlFor={transferId} style={{ marginRight: 4 }}>
            Shares to transfer
          </label>
          <input
            id={transferId}
            type="number"
            disabled={!toAndFromSelected}
            placeholder={placeholder}
          />
          <ConfirmOrCancel
            onConfirm={() => {
              if (
                selectedIdFromTransfer == null ||
                selectedIdToTransfer == null
              ) {
                dispatch(addMessage("To and From accounts must be selected."));
              }
            }}
            onCancel={() => {
              setToggledTransfer(false);
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
      </div>
    );
  };

  return (
    <>
      {renderTopButtons()}
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
        onCreate={async () => {
          await getAccounts();
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

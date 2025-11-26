import { Account, Holding } from "@/network/account";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddHoldingDialog from "../dialog/AddHoldingDialog";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export type AccountTableHandle = {};

interface AccountTableProps {
  accounts: Account[];
  onUpdate: () => void;
}

const AccountsTable = forwardRef(function AccountsTable(
  { accounts, onUpdate }: AccountTableProps,
  ref
) {
  const [accountForAddHolding, setAccountForAddHolding] = useState<
    undefined | Account | null
  >(null);
  const [selectHoldingForDelete, setSelectHoldingForDelete] = useState<
    null | number
  >(null);

  useImperativeHandle(ref, () => {
    return {};
  });

  const getColumns = (): Columns<Account>[] => {
    return [
      {
        field: "name",
        header: "Name",
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

  const getHoldingColumns = (): Columns<Holding>[] => {
    return [
      {
        field: "name",
        header: "Name",
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
          const id = holding.id;
          if (selectHoldingForDelete == id) {
            return <div></div>;
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
          onUpdate();
        }}
      />
    </>
  );
});

export default AccountsTable;

import { Account, fetchAccounts, Holding } from "@/network/account";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddHoldingDialog from "../dialog/AddHoldingDialog";

export type AccountTableHandle = {};

interface AccountTableProps {
  accounts: Account[];
}

const AccountsTable = forwardRef(function AccountsTable(
  { accounts }: AccountTableProps,
  ref
) {
  const [accountForAddHolding, setAccountForAddHolding] = useState<
    undefined | Account | null
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
          console.log("create add holding");
        }}
      />
    </>
  );
});

export default AccountsTable;

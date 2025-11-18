import { Account, fetchAccounts } from "@/network/account";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddHoldingDialog from "../dialog/AddHoldingDialog";

export type AccountTableHandle = {
  refreshData: () => void;
};

const AccountsTable = forwardRef(function AccountsTable(props, ref) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountForAddHolding, setAccountForAddHolding] = useState<
    undefined | Account | null
  >(null);

  const getAccounts = async () => {
    const result = await fetchAccounts();
    console.log(result);
    setAccounts(result);
  };

  useImperativeHandle(ref, () => {
    return {
      refreshData: async () => {
        await getAccounts();
      },
    };
  });

  const getColumns = (): Columns[] => {
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

  useMount(() => {
    getAccounts();
  });

  return (
    <>
      <Table columns={getColumns()} dataList={accounts}></Table>
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

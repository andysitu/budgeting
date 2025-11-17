import { Account, fetchAccounts } from "@/network/account";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table, { Columns } from "./Table";
import { useMount } from "@/lib/common/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export type AccountTableHandle = {
  refreshData: () => void;
};

const AccountsTable = forwardRef(function AccountsTable(props, ref) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const getAccounts = async () => {
    const result = await fetchAccounts();
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
        render: (data) => {
          return (
            <div>
              <button className="icon">
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

  return <Table columns={getColumns()} dataList={accounts}></Table>;
});

export default AccountsTable;

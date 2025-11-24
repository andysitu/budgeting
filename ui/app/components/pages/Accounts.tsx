import { faPlus, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import AddAccountDialog from "../dialog/AddAccountDialog";
import AccountsTable, { AccountTableHandle } from "../table/AccountsTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Account, fetchAccounts } from "@/network/account";
import { useMount } from "@/lib/common/util";

function Accounts() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const accountTableRef = useRef<AccountTableHandle>(null);

  const snackbarState = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();

  const toggleTransferHoldings = () => {
    // check if there are 2 accounts / holdings first
  };

  const getAccounts = async () => {
    const result = await fetchAccounts();
    console.log(result);
    setAccounts(result);
  };

  const refreshData = async () => {
    await getAccounts();
  };

  useMount(() => {
    getAccounts();
  });

  return (
    <div>
      <div>
        <button
          className="icon"
          onClick={() => {
            setAddDialogOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button
          className="icon"
          onClick={() => {
            toggleTransferHoldings();
          }}
        >
          <FontAwesomeIcon icon={faRightLeft} />
        </button>
        <AccountsTable ref={accountTableRef} accounts={accounts} />
      </div>
      <AddAccountDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
        }}
        onCreate={async () => {
          await refreshData();
        }}
      />
    </div>
  );
}

export default Accounts;

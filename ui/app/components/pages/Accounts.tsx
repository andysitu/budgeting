import { faPlus, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import AddAccountDialog from "../dialog/AddAccountDialog";
import AccountsTable, { AccountTableHandle } from "../table/AccountsTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Account, fetchAccounts } from "@/network/account";
import { useMount } from "@/lib/common/util";
import { addMessage } from "@/lib/features/snackbar/snackbarSlice";

function Accounts() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const accountTableRef = useRef<AccountTableHandle>(null);

  const snackbarState = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();

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
        <AccountsTable
          ref={accountTableRef}
          accounts={accounts}
          onUpdate={() => {
            getAccounts();
          }}
        />
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

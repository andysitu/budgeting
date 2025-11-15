import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import AddAccountDialog from "../dialog/AddAccountDialog";
import AccountsTable, { AccountTableHandle } from "../table/AccountsTable";

function Accounts() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const accountTableRef = useRef<AccountTableHandle>(null);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setAddDialogOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <AccountsTable ref={accountTableRef} />
      </div>
      <AddAccountDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
        }}
        onCreate={() => {
          if (accountTableRef?.current?.refreshData) {
            accountTableRef.current.refreshData();
          }
        }}
      />
    </div>
  );
}

export default Accounts;

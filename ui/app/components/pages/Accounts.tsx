import { faPlus, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import AddAccountDialog from "../dialog/AddAccountDialog";
import AccountsTable, { AccountTableHandle } from "../table/AccountsTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

function Accounts() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const accountTableRef = useRef<AccountTableHandle>(null);

  const snackbarState = useSelector((state: RootState) => state.snackbar);
  const dispatch = useDispatch();

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
            //
          }}
        >
          <FontAwesomeIcon icon={faRightLeft} />
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

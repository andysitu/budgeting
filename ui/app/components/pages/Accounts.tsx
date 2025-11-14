import { Account, fetchAccounts } from "@/network/account";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import AddAccountDialog from "../dialog/AddAccountDialog";

function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const getAccounts = async () => {
    try {
      const result = await fetchAccounts();
      setAccounts(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

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
      </div>
      <AddAccountDialog
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
        }}
        onCreate={() => {
          getAccounts();
        }}
      />
    </div>
  );
}

export default Accounts;

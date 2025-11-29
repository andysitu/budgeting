import { useRef } from "react";
import AccountsTable, { AccountTableHandle } from "../table/AccountsTable";

function Accounts() {
  const accountTableRef = useRef<AccountTableHandle>(null);

  return (
    <div>
      <AccountsTable ref={accountTableRef} />
    </div>
  );
}

export default Accounts;

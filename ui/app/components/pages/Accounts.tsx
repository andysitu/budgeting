import { HoldingType } from '@/network/holdingType';
import { useRef } from 'react';
import AccountsTable, { AccountTableHandle } from '../table/AccountsTable';

function Accounts({
  types,
  onUpdate,
}: {
  types: HoldingType[];
  onUpdate: () => void;
}) {
  const accountTableRef = useRef<AccountTableHandle>(null);

  return (
    <div>
      <AccountsTable ref={accountTableRef} types={types} onUpdate={onUpdate} />
    </div>
  );
}

export default Accounts;

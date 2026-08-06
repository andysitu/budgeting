import Tabs from "./components/tabs";
import Expenses from "./components/pages/Expenses";
import Incomes from "./components/pages/Incomes";
import Vendors from "./components/pages/Vendors";
import Accounts from "./components/pages/Accounts";
import Snackbar from "./components/dialog/Snackbar";

export default function Home() {
  return (
    <main>
      <div>
        <Tabs
          elements={{
            Accounts: <Accounts />,
            Expense: <Expenses />,
            Income: <Incomes />,
            Vendors: <Vendors />,
          }}
        />
      </div>
      <Snackbar />
    </main>
  );
}

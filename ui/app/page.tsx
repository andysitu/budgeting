import Tabs from "./components/tabs";
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
            Vendors: <Vendors />,
          }}
        />
      </div>
      <Snackbar />
    </main>
  );
}

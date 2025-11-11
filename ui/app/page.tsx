"use client";

import Tabs from "./components/tabs";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import UrlLibrary from "./library/UrlLibrary";
import Expenses from "./components/pages/Expenses";
import Incomes from "./components/pages/Incomes";
import Purchases from "./components/pages/Purchases";
import Vendors from "./components/pages/Vendors";
import Accounts from "./components/pages/Accounts";

export default function Home() {
  const router = useRouter();
  const { loggedIn, checkedLoginStatus } = useAppSelector(
    (state) => state.userAccount
  );

  return (
    <main>
      <div>
        <Tabs
          elements={{
            Accounts: <Accounts />,
            Expense: <Expenses />,
            Income: <Incomes />,
            Purchase: <Purchases />,
            Vendors: <Vendors />,
          }}
        />
      </div>
    </main>
  );
}

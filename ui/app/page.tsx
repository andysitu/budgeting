"use client";

import Tabs from "./components/tabs";
import { useRef } from "react";
import { ExpenseTableHandle } from "./components/table/ExpenseTable";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import UrlLibrary from "./library/UrlLibrary";
import Expenses from "./components/pages/Expenses";
import Incomes from "./components/pages/Incomes";

export default function Home() {
  const router = useRouter();
  const { loggedIn, checkedLoginStatus } = useAppSelector(
    (state) => state.userAccount
  );

  const expenseTable = useRef<ExpenseTableHandle>(null);

  if (checkedLoginStatus && !loggedIn) {
    router.push(`${UrlLibrary.LOGIN}`);
  }

  return (
    <main>
      <div>
        <Tabs
          elements={{
            Expense: <Expenses />,
            Income: <Incomes />,
          }}
        />
      </div>
    </main>
  );
}

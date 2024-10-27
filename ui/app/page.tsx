"use client";

import Tabs from "./components/tabs";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseDialog from "./components/dialog/AddExpenseDialog";
import ExpenseTable, {
  ExpenseTableHandle,
} from "./components/table/ExpenseTable";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import UrlLibrary from "./library/UrlLibrary";

export default function Home() {
  const router = useRouter();
  const { loggedIn } = useAppSelector((state) => state.userAccount);

  const [dialogOpen, setDialogOpen] = useState(false);

  const expenseTable = useRef<ExpenseTableHandle>(null);

  if (!loggedIn) {
    router.push(`${UrlLibrary.LOGIN}`);
  }

  return (
    <main>
      <div>
        <Tabs
          elements={{
            Expense: (
              <div>
                <div>
                  <button
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
                <div>
                  <ExpenseTable ref={expenseTable} />
                </div>
              </div>
            ),
            Income: <div>Test2</div>,
          }}
        />
      </div>
      <AddExpenseDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onCreate={() => {
          if (expenseTable.current) {
            try {
              expenseTable.current.refreshData();
            } catch (error) {
              console.log("error refreshing data");
            }
          }
        }}
      />
    </main>
  );
}

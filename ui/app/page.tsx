"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Tabs from "./components/tabs";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseDialog from "./components/dialog/AddExpenseDialog";
import ExpenseTable, {
  ExpenseTableHandle,
} from "./components/table/ExpenseTable";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const expenseTable = useRef<ExpenseTableHandle>(null);

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
            expenseTable.current.refreshData();
          }
        }}
      />
    </main>
  );
}

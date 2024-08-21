"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Tabs from "./components/tabs";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseDialog from "./components/dialog/AddExpenseDialog";
import { fetchExpenses } from "@/network/expense";
import ExpenseTable from "./components/table/ExpenseTable";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    const expenses = await fetchExpenses();

    console.log("expenses", expenses);

    setExpenses(expenses);
  };

  useEffect(() => {
    getExpenses();
  }, []);

  return (
    <main>
      <div>
        <Tabs
          elements={{
            Expense: (
              <div>
                <div>
                  <ExpenseTable />
                </div>
                <button
                  onClick={() => {
                    setDialogOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
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
          //
        }}
      />
    </main>
  );
}

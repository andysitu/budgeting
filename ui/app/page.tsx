"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Tabs from "./components/tabs";
import { useEffect, useState } from "react";
import Dialog from "./components/dialog/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseDialog from "./components/dialog/AddExpenseDialog";
import { fetchExpenses } from "@/network/expense";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);

  const getExpenses = async () => {
    const expenses = await fetchExpenses();

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
        onSubmit={() => {
          //
        }}
      />
    </main>
  );
}

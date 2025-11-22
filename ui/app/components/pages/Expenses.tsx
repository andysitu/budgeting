import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddExpenseDialog from "../dialog/AddExpenseDialog";
import ExpenseTable, { ExpenseTableHandle } from "../table/ExpenseTable";

function Expenses() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const expenseTable = useRef<ExpenseTableHandle>(null);

  return (
    <>
      <div>
        <div>
          <button
            className="icon"
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
    </>
  );
}

export default Expenses;

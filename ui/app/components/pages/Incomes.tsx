import { useRef, useState } from "react";
import IncomeTable, { IncomeTableHandle } from "../table/IncomeTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddIncomeDialog from "../dialog/AddIncomeDialog";

function Incomes() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const incomeTable = useRef<IncomeTableHandle>(null);

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
        <IncomeTable ref={incomeTable} />
      </div>
      <AddIncomeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onCreate={() => {
          if (incomeTable.current) {
            try {
              incomeTable.current.refreshData();
            } catch (error) {
              console.log("error refreshing data");
            }
          }
        }}
      />
    </>
  );
}

export default Incomes;

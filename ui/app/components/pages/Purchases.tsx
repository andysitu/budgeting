import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import PurchaseTable, { PurchaseTableHandle } from "../table/PurchaseTable";
import AddPurchaseDialog from "../dialog/AddPurchaseDialog";

function Purchases() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const purchseTable = useRef<PurchaseTableHandle>(null);

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
            <FontAwesomeIcon color="green" icon={faPlus} />
          </button>
        </div>
        <PurchaseTable ref={purchseTable} />
      </div>
      <AddPurchaseDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onCreate={() => {
          if (purchseTable.current) {
            try {
              purchseTable.current.refreshData();
            } catch (error) {
              console.error("error refreshing data");
            }
          }
        }}
      />
    </>
  );
}

export default Purchases;

import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import VendorTable, { VendorTableHandle } from "../table/VendorTable";
import AddVendorDialog from "../dialog/AddVendorDialog";

function Vendors() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const vendorTable = useRef<VendorTableHandle>(null);

  return (
    <>
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
        <VendorTable ref={vendorTable} />
      </div>
      <AddVendorDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onCreate={() => {
          if (vendorTable.current) {
            try {
              vendorTable.current.refreshData();
            } catch (error) {
              console.log("error refreshing data");
            }
          }
        }}
      />
    </>
  );
}

export default Vendors;

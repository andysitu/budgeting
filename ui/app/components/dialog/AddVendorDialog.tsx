import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";
import { createVendor } from "@/network/vendor";

export type VendorData = {
  name: string;
  description: string;
};

interface AddVendorDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (createdIncome: VendorData) => void;
}

function AddVendorDialog({ open, onClose, onCreate }: AddVendorDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const clearData = () => {
    setName("");
    setDescription("");
  };

  return (
    <Dialog
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={async () => {
        let dateObj;

        const data: VendorData = {
          name,
          description,
        };

        try {
          setLoading(true);
          const response = await createVendor(data);

          onCreate(response);

          clearData();
        } catch (error) {
          console.error("Error creating income", error);
        } finally {
          setLoading(false);
        }
      }}
    >
      <TextListItem
        value={name}
        label="Name"
        onChange={(value: string) => setName(value)}
        type="text"
        containerStyle={{ marginBottom: "12px" }}
      />
      <TextListItem
        value={description}
        label="Description"
        onChange={(value: string) => setDescription(value)}
        type="text"
        containerStyle={{ marginBottom: "12px" }}
      />
    </Dialog>
  );
}

export default AddVendorDialog;

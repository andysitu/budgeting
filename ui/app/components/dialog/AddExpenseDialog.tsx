import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
}

function AddExpenseDialog({ open, onClose }: AddExpenseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <Dialog open={open} onClose={onClose}>
      <TextListItem
        value={name}
        label="Name"
        onChange={(value) => setName(value)}
        type="text"
        containerStyle={{ marginBottom: "12px" }}
      />
      <TextListItem
        value={description}
        label="Description"
        onChange={(value) => setDescription(value)}
        type="text"
        containerStyle={{ marginBottom: "12px" }}
      />
      <TextListItem
        value={amount}
        label="Amount"
        onChange={(value) => setAmount(value)}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
    </Dialog>
  );
}

export default AddExpenseDialog;

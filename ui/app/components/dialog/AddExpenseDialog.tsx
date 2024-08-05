import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";

type ExpenseData = {
  name: string;
  description: string;
  amount: string | number;
};

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseData) => void;
}

function AddExpenseDialog({ open, onClose, onSubmit }: AddExpenseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onSubmit={() => {
        const data = {
          name,
          description,
          amount,
        };
        onSubmit(data);
      }}
    >
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

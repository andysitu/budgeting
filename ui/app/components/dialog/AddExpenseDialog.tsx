import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";
import { createExpense } from "@/network/expense";
import ListItem from "../inputs/ListItem";

export type ExpenseData = {
  name: string;
  description: string;
  amount: number;
};

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (createdExpense: ExpenseData) => void;
}

function AddExpenseDialog({ open, onClose, onCreate }: AddExpenseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onSubmit={async () => {
        const data = {
          name,
          description,
          amount: Number(amount),
        };

        const response = await createExpense(data);

        onCreate(response);
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
      <ListItem label="Date">
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          />
        </div>
      </ListItem>
    </Dialog>
  );
}

export default AddExpenseDialog;

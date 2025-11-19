import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";
import { createExpense, Expense } from "@/network/expense";
import ListItem from "../inputs/ListItem";
import VendorSelect from "../select/VendorSelect";

export type ExpenseData = {
  name: string;
  description: string;
  amount: number;
  date?: Date;
  vendorId?: number | string;
  expenseType?: string;
};

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (createdExpense: Expense) => void;
}

function AddExpenseDialog({ open, onClose, onCreate }: AddExpenseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vendor, setVendor] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const clearData = () => {
    setName("");
    setDescription("");
    setAmount("");
  };

  return (
    <Dialog
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={async () => {
        let dateObj;
        if (date && time) {
          dateObj = new Date(`${date}T${time}`);
        } else if (date) {
          dateObj = new Date(date);
        }

        const data: ExpenseData = {
          name,
          description,
          amount: Number(amount),
        };

        if (vendor) {
          data.vendorId = vendor;
        }

        if (dateObj) {
          data.date = dateObj;
        }

        try {
          setLoading(true);
          const response = await createExpense(data);

          onCreate(response);

          clearData();
        } catch (error) {
          console.error("Error creating expense", error);
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
      <TextListItem
        value={amount}
        label="Amount"
        onChange={(value: string) => setAmount(value)}
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
      <ListItem label="Vendor">
        <VendorSelect
          value={String(vendor)}
          onSelect={(vendor) => setVendor(Number(vendor))}
        />
      </ListItem>
    </Dialog>
  );
}

export default AddExpenseDialog;

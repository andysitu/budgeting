import { useRef, useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";
import ListItem from "../inputs/ListItem";
import { createIncome } from "@/network/income";
import VendorSelect from "../select/VendorSelect";

export type IncomeData = {
  name: string;
  description: string;
  amount: number;
  date?: Date;
  vendorId?: number | string;
};

interface AddIncomeDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (createdIncome: IncomeData) => void;
}

function AddIncomeDialog({ open, onClose, onCreate }: AddIncomeDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vendor, setVendor] = useState<string | number>("");

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const clearData = () => {
    setName("");
    setDescription("");
    setAmount("");
  };

  const handleSubmit = async () => {
    let dateObj;
    if (date && time) {
      dateObj = new Date(`${date}T${time}`);
    } else if (date) {
      dateObj = new Date(date);
    }
    const data: IncomeData = {
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
      const response = await createIncome(data);

      onCreate(response);

      clearData();
    } catch (error) {
      console.error("Error creating income", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={"Add Income"}
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={async () => handleSubmit}
      focusInput={nameInputRef?.current}
    >
      <TextListItem
        value={name}
        label="Name"
        onChange={(value: string) => setName(value)}
        type="text"
        containerStyle={{ marginBottom: "12px" }}
        ref={nameInputRef}
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
        <VendorSelect value={vendor} onSelect={(vendor) => setVendor(vendor)} />
      </ListItem>
    </Dialog>
  );
}

export default AddIncomeDialog;

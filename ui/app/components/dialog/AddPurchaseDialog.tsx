import { useState } from "react";
import TextListItem from "../inputs/TextLisItem";
import Dialog from "./Dialog";
import ListItem from "../inputs/ListItem";
import { createPurchase, PurchaseData } from "@/network/purchase";

interface AddPurchaseDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (createdIncome: PurchaseData) => void;
}

function AddPurchaseDialog({
  open,
  onClose,
  onCreate,
}: AddPurchaseDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  const clearData = () => {
    setName("");
    setDescription("");
    setAmount("");
    setDate("");
    setTime("");
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
        const data: PurchaseData = {
          name,
          description,
          amount: Number(amount),
        };

        if (dateObj) {
          data.date = dateObj;
        }

        try {
          setLoading(true);
          const response = await createPurchase(data);

          onCreate(response);

          clearData();
          setLoading(false);
        } catch (error) {
          console.error("Error creating income", error);
        }
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

export default AddPurchaseDialog;

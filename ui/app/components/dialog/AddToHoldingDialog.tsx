import { useRef, useState } from "react";
import Dialog from "./Dialog";
import TextListItem from "../inputs/TextLisItem";
import { Holding } from "@/network/account";
import CheckboxListItem from "../inputs/CheckboxListItem";
import { addToHolding, AddToHolding } from "@/network/holding";

interface AddHoldingDialogProps {
  holding?: Holding;
  open: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

function AddToHoldingDialog({
  holding,
  open,
  onClose,
  onAdd,
}: AddHoldingDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shares, setShares] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [modifyHolding, setModifHolding] = useState(true);

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const resetDialog = () => {
    setName("");
    setDescription("");
    setShares("");
    setAmount("");
  };

  const handleSubmit = async () => {
    const id = holding?.id;
    if (holding == null || id == null) return;
    const data: AddToHolding = {
      id: holding.id,
      shares,
      amount,
      description,
      modifyHolding,
    };
    try {
      const id = holding?.id;
      if (id == null) return;
      setLoading(true);
      const response = await addToHolding(data);
      console.log(response);
      resetDialog();
      onAdd(response);
    } catch (error) {
      console.error("Error adding to holding", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={"Add to Holding"}
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={() => {
        handleSubmit();
      }}
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
        value={shares}
        label="Shares"
        onChange={(value: string) => {
          if (value == "") {
            setShares(value);
          } else if (Number(value) > 0) {
            setShares(Number(value));
          }
        }}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
      <TextListItem
        value={amount}
        label="Amount"
        onChange={(value: string) => {
          if (value == "") {
            setAmount(value);
          } else if (Number(value) > 0) {
            setAmount(Number(value));
          }
        }}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
      <CheckboxListItem
        label="Modify Holding"
        value={modifyHolding}
        onChange={(value: boolean) => setModifHolding(value)}
      />
    </Dialog>
  );
}

export default AddToHoldingDialog;

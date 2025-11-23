import { useRef, useState } from "react";
import Dialog from "./Dialog";
import TextListItem from "../inputs/TextLisItem";
import { AccountData, createAccount } from "@/network/account";

interface AddIncomeDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

function AddAccountDialog({ open, onClose, onCreate }: AddIncomeDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const resetDialog = () => {
    setName("");
    setDescription("");
  };

  const handleSubmit = async () => {
    const data: AccountData = {
      name,
      description,
    };

    try {
      setLoading(true);
      const response = await createAccount(data);
      resetDialog();
      onCreate();
    } catch (error) {
      console.error("Error creating account", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={"Add Account"}
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
    </Dialog>
  );
}

export default AddAccountDialog;

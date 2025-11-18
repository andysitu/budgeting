import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import TextListItem from "../inputs/TextLisItem";
import {
  Account,
  AccountData,
  HoldingData,
  addHoldingsToAccount,
} from "@/network/account";

interface AddHoldingDialogProps {
  account: Account | undefined | null;
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}

function AddHoldingDialog({
  account,
  open,
  onClose,
  onCreate,
}: AddHoldingDialogProps) {
  const [name, setName] = useState("");
  const [shares, setShares] = useState(1);
  const [price, setPrice] = useState(1);

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && nameInputRef?.current?.focus) {
      nameInputRef.current.focus();
    }
  }, [open]);

  const resetDialog = () => {
    setName("");
    setShares(1);
    setPrice(1);
  };

  const handleSubmit = async () => {
    const data: HoldingData = {
      name,
      shares,
      price,
    };

    try {
      const accountId = account?.id;
      if (accountId == null) return;
      setLoading(true);

      const response = await addHoldingsToAccount(accountId, [data]);
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
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={() => {
        handleSubmit();
      }}
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
        value={shares}
        label="Shares"
        onChange={(value: string) => setShares(Number(value))}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
      <TextListItem
        value={price}
        label="Price"
        onChange={(value: string) => setPrice(Number(value))}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
    </Dialog>
  );
}

export default AddHoldingDialog;

import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import TextListItem from "../inputs/TextLisItem";
import { Holding } from "@/network/account";
import { editHolding, EditHoldingData } from "@/network/holding";
import { useDispatch } from "react-redux";
import { addMessage } from "@/lib/features/snackbar/snackbarSlice";

interface EditHoldingDialogProps {
  holding?: Holding;
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

function EditHoldingDialog({
  holding,
  open,
  onClose,
  onUpdate,
}: EditHoldingDialogProps) {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [shares, setShares] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (holding != null) {
      setName(holding.name);
      setPrice(holding.price);
      setShares(holding.shares);
    }
  }, [holding]);

  const resetDialog = () => {
    setName(holding?.name ?? "");
    setPrice(holding?.price ?? "");
    setShares(holding?.shares ?? "");
  };

  const handleSubmit = async () => {
    const id = holding?.id;
    if (holding == null || id == null) return;

    const sharesValue = shares == "" ? undefined : shares,
      priceValue = price == "" ? undefined : price;

    const validShares = sharesValue && sharesValue > 0,
      validPrice = priceValue && priceValue > 0;

    if (!validShares || !validPrice) {
      return dispatch(addMessage("Please enter a valid price and shares"));
    }

    const data: EditHoldingData = {
      id: holding.id,
      shares: sharesValue,
      amount: priceValue,
    };

    try {
      const id = holding?.id;
      if (id == null) return;
      setLoading(true);
      const response = await editHolding(data);
      onUpdate(response);
      resetDialog();
    } catch (error) {
      console.error("Error adding to holding", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={`Edit Holding ${holding?.name ?? ""}`}
      loading={loading}
      open={open}
      onClose={onClose}
      onSubmit={() => {
        handleSubmit();
      }}
      onReset={resetDialog}
      focusInput={nameInputRef?.current}
      containerStyle={{ minWidth: "600px" }}
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
        value={price}
        label="Amount"
        onChange={(value: string) => {
          if (value == "") {
            setPrice(value);
          } else if (Number(value) > 0) {
            setPrice(Number(value));
          }
        }}
        type="number"
        containerStyle={{ marginBottom: "12px" }}
      />
    </Dialog>
  );
}

export default EditHoldingDialog;

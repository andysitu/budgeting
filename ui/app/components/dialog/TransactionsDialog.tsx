import { useState } from "react";
import Dialog from "./Dialog";

interface TransactionsDialogProps {
  open: boolean;
  onClose: () => void;
  holdingId: number;
}

function TransactionsDialog({
  open,
  onClose,
  holdingId,
}: TransactionsDialogProps) {
  return (
    <Dialog title="Transactions" open={open} onClose={onClose}>
      <div>Test</div>
    </Dialog>
  );
}

export default TransactionsDialog;

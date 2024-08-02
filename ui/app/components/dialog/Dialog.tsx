import { ReactNode } from "react";
import styles from "./dialog.module.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode[] | ReactNode;
  id: string;
}

function Dialog({ open, onClose, children, id }: DialogProps) {
  const showClassName = open ? styles["modal-show"] : styles["modal-hidden"];
  return (
    <>
      <dialog
        id={id}
        open={open}
        className={`${styles.modal} ${showClassName}`}
      >
        <div>
          <button
            onClick={() => {
              onClose();
            }}
          >
            Close
          </button>
          {children}
        </div>
      </dialog>
      <div
        className={`${styles["modal-backdrop"]} ${showClassName}`}
        onClick={onClose}
      />
    </>
  );
}

export default Dialog;

import { ReactNode } from "react";
import styles from "./dialog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode[] | ReactNode;
  id?: string;
}

function Dialog({ open, onClose, children, id }: DialogProps) {
  const showClassName = open ? styles["modal-show"] : styles["modal-hidden"];
  return (
    <>
      <dialog
        id={id}
        open={open}
        className={`${styles.modal} ${showClassName}`}
        style={{
          border: "1px solid lightgray",
          minWidth: "200px",
          minHeight: "140px",
          padding: "8px 10px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button
            className={"icon"}
            onClick={() => {
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <div>{children}</div>
      </dialog>
      <div
        className={`${styles["modal-backdrop"]} ${showClassName}`}
        onClick={onClose}
      />
    </>
  );
}

export default Dialog;

import { ReactNode } from "react";
import styles from "./dialog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode[] | ReactNode;
  id?: string;
  onSubmit?: () => void;
}

function Dialog({ open, onClose, children, id, onSubmit }: DialogProps) {
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
          padding: "4px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "8px",
          }}
        >
          <button
            className={"icon"}
            onClick={() => {
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (onSubmit) {
              onSubmit();
            }
          }}
        >
          <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            {children}

            {onSubmit && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "10px",
                }}
              >
                <button>Submit</button>
              </div>
            )}
          </div>
        </form>
      </dialog>
      <div
        className={`${styles["modal-backdrop"]} ${showClassName}`}
        onClick={onClose}
      />
    </>
  );
}

export default Dialog;

import { ReactNode, useEffect } from "react";
import styles from "./dialog.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Loading from "../icons/Loading";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode[] | ReactNode;
  id?: string;
  title?: string;
  onReset?: () => void;
  onSubmit?: () => void;
  loading?: boolean;
  focusInput?: HTMLElement | null | undefined;
  containerStyle?: React.CSSProperties;
}

function Dialog({
  open,
  onClose,
  children,
  id,
  onReset,
  onSubmit,
  title,
  loading,
  focusInput,
  containerStyle = {},
}: DialogProps) {
  const showClassName = open ? "" : styles["modal-hidden"];

  useEffect(() => {
    if (open && focusInput?.focus) {
      focusInput.focus();
    }
  }, [focusInput, open]);

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
            alignItems: "center",
            marginBottom: "8px",
            paddingTop: "4px",
            paddingLeft: "10px",
            paddingRight: "10px",
            ...containerStyle,
          }}
        >
          {title && <div>{title}</div>}
          <div style={{ flexGrow: 1 }} />
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

            if (loading) return;

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
                  marginTop: "4px",
                  marginBottom: "10px",
                }}
              >
                {!loading && onReset && (
                  <button
                    onClick={() => onReset()}
                    style={{ marginRight: "4px" }}
                    type="button"
                  >
                    Reset
                  </button>
                )}
                <button>{loading ? <Loading /> : "Submit"}</button>
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

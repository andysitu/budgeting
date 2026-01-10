import { useEffect, useState } from "react";
import styles from "./dialog.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { hideLastMessage } from "@/lib/features/snackbar/snackbarSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Snackbar() {
  const delayTime = 10000;
  const id = "snackbar-main";

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);

  const snackbarState = useSelector((state: RootState) => state.snackbar);
  const message = snackbarState.message;

  useEffect(() => {
    if (message) {
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
        dispatch(hideLastMessage());
      }, delayTime);
    }
  }, [message, dispatch]);

  const snackbarClass = visible
    ? `${styles.snackbar} ${styles.show}`
    : styles.snackbar;

  const color = "#FFD4CC";

  return (
    <div
      id={id}
      className={snackbarClass}
      style={{
        width: 20,
        backgroundColor: color,
        borderRadius: "7px",
        padding: "20px 20px",
        maxWidth: "100px",
        overflowWrap: "break-word",
      }}
    >
      <button
        className={"icon"}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: color,
        }}
        onClick={() => setVisible(false)}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
      {message}
    </div>
  );
}

export default Snackbar;

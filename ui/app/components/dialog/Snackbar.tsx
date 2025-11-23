import { useEffect, useState } from "react";
import styles from "./dialog.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { hideLastMessage } from "@/lib/features/snackbar/snackbarSlice";

function Snackbar() {
  const delayTime = 10000;
  const id = "snackbar-main";

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(true);

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

  return (
    <div id={id} className={snackbarClass}>
      {message}
    </div>
  );
}

export default Snackbar;

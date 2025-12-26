import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

export type ConfirmOrCancelProps = {
  onConfirm: () => void;
  onCancel: () => void;
  disabled: boolean;
};

function ConfirmOrCancel({
  onConfirm,
  onCancel,
  disabled,
}: ConfirmOrCancelProps) {
  return (
    <div>
      <button
        className={"icon"}
        onClick={() => {
          onConfirm();
        }}
        disabled={disabled}
      >
        <FontAwesomeIcon color="green" icon={faCheck} />
      </button>
      <button
        className={"icon"}
        onClick={() => {
          onCancel();
        }}
      >
        <FontAwesomeIcon color="red" icon={faXmark} />
      </button>
    </div>
  );
}

export default ConfirmOrCancel;

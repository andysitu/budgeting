import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";

export type ConfirmOrCancelProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmOrCancel({ onConfirm, onCancel }: ConfirmOrCancelProps) {
  return (
    <div>
      <button
        className={"icon"}
        onClick={() => {
          onConfirm();
        }}
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

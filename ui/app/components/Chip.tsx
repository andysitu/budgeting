import styles from './chip.module.css';

interface ChipProps {
  label: string;
  title?: string;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function Chip({
  label,
  title,
  onRemove,
  disabled = false,
}: ChipProps) {
  return (
    <span className={styles.chip} title={title}>
      {label}
      {onRemove && (
        <button
          type="button"
          className={styles.remove}
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
}

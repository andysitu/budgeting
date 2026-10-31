import { useEffect, useId, useRef, useState } from 'react';
import { HoldingType } from '@/network/holdingType';
import styles from './holdingtypepicker.module.css';
import Chip from '../Chip';

interface Props {
  types: HoldingType[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
}

export default function HoldingTypePicker({
  types,
  selectedIds,
  onChange,
  disabled,
}: Props) {
  const triggerId = useId();
  const optionsId = `${triggerId}-options`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const availableTypes = types;
  const selectedTypes = types.filter((type) => selectedIds.includes(type.id));
  const isOpen = open && !disabled;

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: Event) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={styles.field}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <label htmlFor={triggerId} className={styles.label}>
        Types <span className={styles.optional}>Optional</span>
      </label>
      <div className={styles.control}>
        <div className={styles.dropdown}>
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            disabled={disabled || availableTypes.length === 0}
            aria-expanded={isOpen}
            aria-controls={optionsId}
            onClick={() => setOpen(!open)}
            className={styles.select}
          >
            <span>Select types…</span>
            <span aria-hidden="true">{isOpen ? '▴' : '▾'}</span>
          </button>
          {isOpen && (
            <div
              id={optionsId}
              role="group"
              aria-label="Holding types"
              className={styles.options}
            >
              {availableTypes.map((type) => (
                <label
                  key={type.id}
                  title={type.description}
                  className={styles.option}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(type.id)}
                    onChange={(event) =>
                      onChange(
                        event.target.checked
                          ? [...selectedIds, type.id]
                          : selectedIds.filter((id) => id !== type.id),
                      )
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        event.currentTarget.click();
                      }
                    }}
                  />
                  <span>{type.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {selectedTypes.length > 0 && (
          <div className={styles.chips}>
            {selectedTypes.map((type) => (
              <Chip
                key={type.id}
                label={type.name}
                title={type.description}
                disabled={disabled}
                onRemove={() =>
                  onChange(selectedIds.filter((id) => id !== type.id))
                }
              />
            ))}
          </div>
        )}
        {availableTypes.length === 0 && (
          <small className={styles.empty}>
            Create types in the Holding types tab.
          </small>
        )}
      </div>
    </div>
  );
}

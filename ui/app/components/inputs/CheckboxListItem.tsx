import { isEmptyObject } from "@/lib/common/util";
import styles from "./textlistitem.module.css";
import ListItem from "./ListItem";
import { forwardRef } from "react";

interface CheckboxListItemProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  containerStyle?: React.CSSProperties;
  // For rest of props going to input
  [key: string]: any;
}

const CheckboxListItem = forwardRef<HTMLInputElement, CheckboxListItemProps>(
  function CheckboxListItemWithRef(
    { label, value, onChange, containerStyle, ...rest },
    ref,
  ) {
    const divStyle: React.CSSProperties = {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    };

    if (!isEmptyObject(containerStyle)) {
      Object.assign(divStyle, containerStyle);
    }

    return (
      <ListItem label={label} containerStyle={divStyle}>
        <input
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked);
          }}
          type={"checkbox"}
          ref={ref}
          {...rest}
        />
      </ListItem>
    );
  },
);

export default CheckboxListItem;

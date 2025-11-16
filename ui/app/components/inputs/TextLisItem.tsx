import { isEmptyObject } from "@/lib/common/util";
import styles from "./textlistitem.module.css";
import ListItem from "./ListItem";
import { forwardRef } from "react";

interface TextListItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  containerStyle?: Record<string, any>;
  // For rest of props going to input
  [key: string]: any;
}

const TextListItem = forwardRef<HTMLInputElement, TextListItemProps>(
  function TextListItemWithRef(
    { label, value, onChange, type = "text", containerStyle, ...rest },
    ref
  ) {
    const divStyle = {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    };

    if (!isEmptyObject(containerStyle)) {
      Object.assign(divStyle, containerStyle);
    }

    return (
      <ListItem label={label} containerStyle={divStyle}>
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          type={type}
          ref={ref}
          {...rest}
        />
      </ListItem>
    );
  }
);

export default TextListItem;

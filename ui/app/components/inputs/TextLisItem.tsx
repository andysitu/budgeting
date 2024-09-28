import { isEmptyObject } from "@/lib/common/util";
import styles from "./textlistitem.module.css";
import ListItem from "./ListItem";

interface TextListItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  containerStyle?: Record<string, any>;
}

function TextListItem({
  label,
  value,
  onChange,
  type = "text",
  containerStyle,
}: TextListItemProps) {
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
      />
    </ListItem>
  );
}

export default TextListItem;

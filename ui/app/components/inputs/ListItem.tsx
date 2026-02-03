import { isEmptyObject } from "@/lib/common/util";
import styles from "./textlistitem.module.css";
import { ReactNode } from "react";

interface TextListItemProps {
  label: ReactNode | string;
  children: ReactNode | string;
  containerStyle?: React.CSSProperties;
}

function ListItem({ label, children, containerStyle }: TextListItemProps) {
  const divStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  };

  if (!isEmptyObject(containerStyle)) {
    Object.assign(divStyle, containerStyle);
  }

  return (
    <div style={divStyle}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
}

export default ListItem;

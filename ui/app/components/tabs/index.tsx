import { ReactElement, useState } from "react";
import styles from "./style.module.css";

type TabsProps = {
  elements: Record<string, ReactElement>;
};

function Tabs({ elements }: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (Object.keys(elements).length === 0) {
    return null;
  }

  const tabs = [],
    displayElements = [];

  let index = 0;
  for (const [name, element] of Object.entries(elements)) {
    const savedIndex = index;

    // Tabs
    tabs.push(
      <div key={`tab-header-${name}`}>
        <div
          className={`${styles.tablinks} ${
            index === selectedIndex ? styles.active : ""
          }`}
          onClick={() => {
            setSelectedIndex(savedIndex);
          }}
        >
          {name}
        </div>
      </div>
    );

    // Elements
    displayElements.push(
      <div
        key={`tab-content-${name}`}
        className={`${styles.tabpanels} ${
          index === selectedIndex ? styles.active : ""
        }`}
      >
        {element}
      </div>
    );

    index++;
  }

  return (
    <div>
      <div style={{ display: "flex" }}>{tabs}</div>
      <div className={styles["tabpanel-container"]}>{displayElements}</div>
    </div>
  );
}

export default Tabs;

"usee client";

import { ReactElement } from "react";
import styles from "./style.module.css";

type TabsProps = {
  elements: Record<string, ReactElement>;
};

function Tabs({ elements }: TabsProps) {
  if (Object.keys(elements).length === 0) {
    return null;
  }

  const inputs = [],
    displayElements = [];

  for (const [name, element] of Object.entries(elements)) {
    inputs.push(
      <div>
        <button className="tablinks">{name}</button>
      </div>
    );
  }

  return inputs;
}

export default Tabs;

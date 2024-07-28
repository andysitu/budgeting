import Image from "next/image";
import styles from "./page.module.css";
import Tabs from "./components/tabs";

export default function Home() {
  return (
    <main>
      <div>
        <Tabs
          elements={{
            test: <div></div>,
          }}
        />
      </div>
    </main>
  );
}

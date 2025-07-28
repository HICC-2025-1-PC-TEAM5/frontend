import { useState } from "react";
import styles from "./RefridgeHeader.module.css";

const tabs = [
  { id: "a", label: "전체" },
  { id: "b", label: "냉장고" },
  { id: "c", label: "냉동실" },
  { id: "d", label: "실온" },
];

export default function RefridgeHeader() {
  const [selected, setSelected] = useState("a");

  return (
    <div className={styles.segmentedControl}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          className={`${styles.tabButton} ${
            selected === id ? styles.active : ""
          }`}
          onClick={() => setSelected(id)}
        >
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  );
}

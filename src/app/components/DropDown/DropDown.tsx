"use client";

import { useState } from "react";
import styles from "./DropDown.module.scss";

export default function DropDown(props: {
  title: string;
  options: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  style?: any;
}) {
  const { title, options, selectedOption, setSelectedOption, style } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper} style={style}>
      <p style={{ marginRight: 10 }}>{title}:</p>
      <div className={styles.selectedOption}>
        <button onClick={() => setOpen(!open)}>{selectedOption}</button>
        {open && (
          <div className={styles.options}>
            {options.map((option) => (
              <button
                key={option}
                className={styles.option}
                onClick={() => {
                  setSelectedOption(option);
                  setOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

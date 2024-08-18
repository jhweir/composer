"use client";

import { useEffect } from "react";
import DropDown from "../DropDown/DropDown";
import styles from "./BlockSettings.module.scss";

export default function BlockSettings(props: {
  block: any;
  parent: any;
  addBlock: (parentId: string) => void;
  editBlock: (blockId: string, options: any) => void;
  deleteBlock: (blockId: string) => void;
}) {
  const { block, parent, addBlock, editBlock, deleteBlock } = props;
  const { id, options, blocks } = block;
  const { direction, size } = options;

  useEffect(() => {
    //
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Block settings</h1>
      {!!parent && (
        <button
          onClick={() => deleteBlock(id)}
          className={styles.newBlockButton}
        >
          Delete block
        </button>
      )}
      <button onClick={() => addBlock(id)} className={styles.newBlockButton}>
        Add child block
      </button>
      {!!parent && (
        <DropDown
          title={parent.options.direction === "row" ? "width" : "height"}
          options={["1/1", "1/2", "1/3", "1/4"]}
          selectedOption={size}
          setSelectedOption={(value) =>
            editBlock(id, { ...options, size: value })
          }
        />
      )}
      <DropDown
        title="direction"
        options={["row", "column"]}
        selectedOption={direction}
        setSelectedOption={(value) =>
          editBlock(id, { ...options, direction: value })
        }
      />
    </div>
  );
}

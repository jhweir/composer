"use client";

import { useEffect, useState } from "react";
import styles from "./BlockTree.module.scss";

export default function BlockTree(props: {
  block: any;
  position: string;
  selectedBlock: any;
  setSelectedBlock: (block: any) => void;
}) {
  const { block, position, selectedBlock, setSelectedBlock } = props;
  const { id } = block;
  const [selected, setSelected] = useState(selectedBlock.id === id);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setSelected(selectedBlock.id === id);
  }, [selectedBlock, id]);

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.blockButton}
        onClick={() => {
          // setCollapsed(!collapsed);
          setSelectedBlock(block);
        }}
      >
        <p className={selected ? styles.selected : ""}>{position}</p>
        {/* {block.blocks.length > 0 && (
          <p style={{ transform: collapsed ? "rotate(180deg)" : "" }}>^</p>
        )} */}
      </button>
      {!collapsed && block.blocks.length > 0 && (
        <div className={styles.children}>
          {block.blocks.map((b: any, i: number) => (
            <BlockTree
              key={b.id}
              block={b}
              position={
                position === "Template" ? `${i + 1}` : `${position}.${i + 1}`
              }
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

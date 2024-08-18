"use client";

import { useEffect, useState } from "react";
import styles from "./Block.module.scss";

export default function Block(props: {
  block: any;
  parentBlock?: any;
  depth: number;
  selectedBlock: any;
  setSelectedBlock: (block: any) => void;
  addBlock: (parentId: string) => void;
  editBlock: (blockId: string, options: any) => void;
}) {
  const {
    block,
    parentBlock,
    depth,
    selectedBlock,
    setSelectedBlock,
    addBlock,
    editBlock,
  } = props;
  const { id, options, blocks } = block;
  const { direction, size } = options;
  const [selected, setSelected] = useState(selectedBlock.id === id);
  const color = 255 - depth * 20;

  function findStyle(): any {
    const blockStyle = {} as any;
    if (parentBlock) {
      const paddingOffset = parentBlock.blocks.length
        ? (20 * (parentBlock.blocks.length - 1)) / parentBlock.blocks.length
        : 0; // 20 = parents padding
      if (parentBlock.options.direction === "row")
        blockStyle.width = `calc(100% / ${size[2]} - ${paddingOffset}px)`;
      else blockStyle.height = `calc(100% / ${size[2]} - ${paddingOffset}px)`;
    }
    return blockStyle;
  }

  useEffect(() => {
    setSelected(selectedBlock.id === id);
  }, [selectedBlock, id]);

  return (
    <div
      className={`${styles.wrapper} ${selected && styles.selected}`}
      style={{
        ...findStyle(),
        backgroundColor: `rgba(${color},${color},${color})`,
      }}
    >
      <button
        className={styles.blockButton}
        onClick={() => setSelectedBlock(block)}
      />
      {blocks.length > 0 && (
        <div className={styles.blocks} style={{ flexDirection: direction }}>
          {blocks.map((b: any) => (
            <Block
              key={b.id}
              block={b}
              depth={depth + 1}
              parentBlock={block}
              addBlock={addBlock}
              editBlock={editBlock}
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
            />
          ))}
        </div>
      )}
    </div>
  );
}

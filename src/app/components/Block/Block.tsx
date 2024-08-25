"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Block.module.scss";

export default function Block(props: {
  block: any;
  depth: number;
  selectedBlock: any;
  setSelectedBlock: (block: any) => void;
  addBlock: (parentId: string) => void;
  editBlock: (blockId: string, setting: string, value: any) => void;
  setDragging: (state: boolean) => void;
  setDragPosition: (position: any) => void; // { x: number, y: number }
  setDragState: (size: any) => void; // { width: number, height: number }
}) {
  const {
    block,
    depth,
    selectedBlock,
    setSelectedBlock,
    addBlock,
    editBlock,
    setDragging,
    setDragPosition,
    setDragState,
  } = props;
  const { id, options, blocks } = block;
  const { span, grid } = options;
  const [selected, setSelected] = useState(selectedBlock.id === id);
  const [isDraggedItem, setIsDraggedItem] = useState(false);

  const color = 255 - depth * 20;
  const wrapper = useRef<HTMLDivElement>(null);

  function findSize(totalItems: number): any {
    // calculates the pixel size of child blocks factoring the total number of items & gap size
    return `calc(${100 / totalItems}% - ${((totalItems - 1) * grid.gap) / totalItems}px)`;
  }

  function onDragStart(event: any) {
    event.stopPropagation();
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    setIsDraggedItem(true);
    setSelectedBlock(block);
    const { width, height, top, left } = wrapper.current!.getBoundingClientRect();
    const { clientX, clientY } = event;
    setDragState({ width, height, xOffset: clientX - left, yOffset: clientY - top });
    setDragPosition({ x: event.clientX, y: event.clientY });
    setDragging(true);
  }

  function onDrag(event: any) {
    const { clientX, clientY } = event;
    if (clientX || clientY) setDragPosition({ x: clientX, y: clientY });
  }

  function onDragEnd(event: any) {
    setIsDraggedItem(false);
    setDragging(false);
  }

  useEffect(() => {
    setSelected(selectedBlock.id === id);
  }, [selectedBlock, id]);

  return (
    <div
      ref={wrapper}
      className={`${styles.wrapper} ${selected && styles.selected}`}
      style={{
        gridRow: `span ${span.y}`,
        gridColumn: `span ${span.x}`,
        gridTemplateRows: `repeat(${grid.y}, ${findSize(grid.y)})`,
        gridTemplateColumns: `repeat(${grid.x}, ${findSize(grid.x)})`,
        gridAutoRows: findSize(grid.y),
        gridAutoColumns: findSize(grid.x),
        gridAutoFlow: grid.flow === "Vertical" ? "row" : "column",
        backgroundColor: `rgba(${color},${color},${color})`,
        gap: grid.gap,
        padding: grid.padding,
        opacity: isDraggedItem ? 0.5 : 1,
      }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      draggable
    >
      <button className={styles.blockButton} onClick={() => setSelectedBlock(block)} />
      {blocks.map((b: any) => (
        <Block
          key={b.id}
          block={b}
          depth={depth + 1}
          addBlock={addBlock}
          editBlock={editBlock}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          setDragging={setDragging}
          setDragPosition={setDragPosition}
          setDragState={setDragState}
        />
      ))}
    </div>
  );
}

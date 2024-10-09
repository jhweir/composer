"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Block.module.scss";

export default function Block(props: {
  block: any;
  depth: number;
  parentBlock?: any;
  selectedBlock: any;
  setSelectedBlock: (block: any) => void;
  addBlock: (parentId: string) => void;
  editBlock: (blockId: string, setting: string, value: any) => void;
  setDragging: (state: boolean) => void;
  setDragPosition: (position: any) => void; // { x: number, y: number }
  setDragState: (size: any) => void; // { width: number, height: number, xOffset: number, yOffset: number }
}) {
  const {
    block,
    depth,
    parentBlock,
    selectedBlock,
    setSelectedBlock,
    addBlock,
    editBlock,
    setDragging,
    setDragPosition,
    setDragState,
  } = props;
  const { id, options, blocks } = block;
  const { area, grid } = options;
  const [selected, setSelected] = useState(selectedBlock?.id === id);
  const [isDraggedItem, setIsDraggedItem] = useState(false);

  const color = 255 - depth * 20;
  const wrapper = useRef<HTMLDivElement>(null);
  const gridStyles = {
    gridTemplateRows: `repeat(${grid.height}, ${findSize(grid.height)})`,
    gridTemplateColumns: `repeat(${grid.width}, ${findSize(grid.width)})`,
    gridAutoRows: findSize(grid.height),
    gridAutoColumns: findSize(grid.width),
    gridAutoFlow: grid.flow === "Vertical" ? "row" : "column",
    gap: grid.gap,
    padding: grid.padding,
  };

  function findSize(totalItems: number): any {
    // calculates the pixel size of child blocks factoring the total number of items & gap size
    return `calc(${100 / totalItems}% - ${((totalItems - 1) * grid.gap) / totalItems}px)`;
  }

  function findDropArea(clientX: number, clientY: number) {
    const parentElement = document.getElementById(`block-${parentBlock.id}`);
    const { width, height, top, left } = parentElement!.getBoundingClientRect();
    const cellWidth = width / parentBlock.options.grid.width;
    const cellHeight = height / parentBlock.options.grid.height;
    const columnNumber = Math.floor((clientX - left) / cellWidth) + 1;
    const rowNumber = Math.floor((clientY - top) / cellHeight) + 1;
    return {
      y: rowNumber,
      x: columnNumber,
      y2: rowNumber + area.y2 - area.y,
      x2: columnNumber + area.x2 - area.x,
    };
  }

  function onDragStart(event: any) {
    event.stopPropagation();
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    setIsDraggedItem(true);
    setSelectedBlock(block);
    const { width, height, top, left } = wrapper.current!.getBoundingClientRect();
    const { clientX, clientY } = event;
    setDragState({ width, height, xOffset: clientX - left, yOffset: clientY - top });
    setDragPosition({ x: clientX, y: clientY });
    setDragging(true);
  }

  function onDrag(event: any) {
    event.stopPropagation();
    const { clientX, clientY } = event;
    if (clientX || clientY) {
      setDragPosition({ x: clientX, y: clientY });
      const { y, x, y2, x2 } = findDropArea(clientX, clientY);
      parentBlock.dropArea = `${y} / ${x} / ${y2} / ${x2}`;
    }
  }

  function onDragEnd(event: any) {
    event.stopPropagation();
    setIsDraggedItem(false);
    setDragging(false);
    const { y, x, y2, x2 } = findDropArea(event.clientX, event.clientY);
    const newOptions = { ...options };
    newOptions.area = { y, x, y2, x2 };
    editBlock(id, "options", newOptions);
    parentBlock.dropArea = "";
  }

  function onDragEnter(event: any) {
    event.stopPropagation();
  }

  useEffect(() => {
    setSelected(selectedBlock?.id === id);
  }, [selectedBlock, id]);

  function resize(event: any, direction: "n" | "e" | "s" | "w" | "nw" | "ne" | "sw" | "se") {
    const blockElement = wrapper.current;

    function startResize(e: any) {
      blockElement!.style.width = e.clientX - blockElement!.getBoundingClientRect().left + "px";
      blockElement!.style.height = e.clientY - blockElement!.getBoundingClientRect().top + "px";
    }

    function stopResize() {
      window.removeEventListener("mousemove", startResize);
      window.removeEventListener("mouseup", stopResize);
    }

    event.preventDefault();
    window.addEventListener("mousemove", startResize);
    window.addEventListener("mouseup", stopResize);
  }

  return (
    <div
      ref={wrapper}
      id={`block-${block.id}`}
      className={`${styles.wrapper} ${selected && styles.selected}`}
      style={{ gridArea: `${area.y} / ${area.x} / ${area.y2} / ${area.x2}` }}
    >
      <div className={styles.backgroundGrid} style={gridStyles}>
        <div
          className={styles.lines}
          style={{ backgroundSize: `calc(100% / ${grid.width}) calc(100% / ${grid.height})` }}
        />
        {block.dropArea && <div className={styles.dropspot} style={{ gridArea: block.dropArea }} />}
      </div>
      <div
        className={styles.mainGrid}
        style={{
          ...gridStyles,
          backgroundColor: `rgba(${color},${color},${color})`,
          opacity: isDraggedItem ? 0.5 : 1,
        }}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        draggable={!!parentBlock}
      >
        <button className={styles.blockButton} onClick={() => setSelectedBlock(block)} />
        {blocks.map((b: any) => (
          <Block
            key={b.id}
            block={b}
            parentBlock={block}
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
        {!!parentBlock && (
          <div className={styles.resizers}>
            <div className={`${styles.edge} ${styles.n}`} onMouseDown={(e) => resize(e, "n")} />
            <div className={`${styles.edge} ${styles.e}`} onMouseDown={(e) => resize(e, "e")} />
            <div className={`${styles.edge} ${styles.s}`} onMouseDown={(e) => resize(e, "s")} />
            <div className={`${styles.edge} ${styles.w}`} onMouseDown={(e) => resize(e, "w")} />
            <div className={`${styles.corner} ${styles.nw}`} onMouseDown={(e) => resize(e, "nw")} />
            <div className={`${styles.corner} ${styles.ne}`} onMouseDown={(e) => resize(e, "ne")} />
            <div className={`${styles.corner} ${styles.sw}`} onMouseDown={(e) => resize(e, "sw")} />
            <div className={`${styles.corner} ${styles.se}`} onMouseDown={(e) => resize(e, "se")} />
          </div>
        )}
      </div>
    </div>
  );
}

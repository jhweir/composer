"use client";

import Block from "@/app/components/Block/Block";
import BlockPreview from "@/app/components/BlockPreview/BlockPreview";
import BlockSettings from "@/app/components/BlockSettings/BlockSettings";
import BlockTree from "@/app/components/BlockTree/BlockTree";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./page.module.scss";

function newBlock() {
  return {
    id: uuidv4(),
    name: "",
    options: {
      area: { y: 1, x: 1, y2: 2, x2: 2 },
      grid: { width: 2, height: 2, flow: "Vertical", gap: 0, padding: 0 },
    },
    type: "we://collection", // 'we://image', 'we://audio' etc.
    depth: 0,
    blocks: [],
    dropspot: false,
  };
}

export default function Composer() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const [rootBlock, setRootBlock] = useState<any>(null);
  const [selectedBlock, setSelectedBlock] = useState(rootBlock);
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState({ width: 0, height: 0, xOffset: 0, yOffset: 0 });

  function findBlock(id: string, block: any) {
    if (id === block.id) return block;
    else
      for (let i = 0; i < block.blocks.length; i++) {
        const match = findBlock(id, block.blocks[i]) as any;
        if (match) return match;
      }
  }

  function findParent(id: string, block: any) {
    for (let i = 0; i < block.blocks.length; i++) {
      if (block.blocks[i].id === id) return block;
      else {
        const match = findParent(id, block.blocks[i]) as any;
        if (match) return match;
      }
    }
  }

  function findNextAvailableSpace(parentBlock: any) {
    const { options, blocks } = parentBlock;
    const { grid, area } = options;
    // loop through every space & check if occupied
    for (let i = 0; i < grid.height; i++) {
      for (let j = 0; j < grid.width; j++) {
        const taken = blocks.find(
          (b: any) => b.options.area.y === i + 1 && b.options.area.x === j + 1
        );
        if (!taken) return { isSpace: true, y: i + 1, x: j + 1 };
      }
    }
    return { isSpace: false, y: 0, x: 0 };
  }

  function addBlock(parentId: string) {
    const newRootBlock = { ...rootBlock };
    const parentBlock = findBlock(parentId, newRootBlock);
    if (!parentBlock.blocks.length) parentBlock.blocks.push(newBlock());
    else {
      const { isSpace, y, x } = findNextAvailableSpace(parentBlock);
      if (isSpace) {
        parentBlock.blocks.push({
          ...newBlock(),
          options: {
            area: { y, x, y2: y + 1, x2: x + 1 },
            grid: { width: 2, height: 2, flow: "Vertical", gap: 0, padding: 0 },
          },
        });
      }
    }
    setRootBlock(newRootBlock);
  }

  function editBlock(blockId: string, setting: string, value: any) {
    const newRootBlock = { ...rootBlock };
    const block = findBlock(blockId, newRootBlock);
    block[setting] = value;
    setRootBlock(newRootBlock);
    setSelectedBlock(block);
  }

  function deleteBlock(blockId: string) {
    const newRootBlock = { ...rootBlock };
    const parent = findParent(blockId, newRootBlock);
    parent.blocks = parent.blocks.filter((b: any) => b.id !== blockId);
    setRootBlock(newRootBlock);
  }

  function saveTemplate() {
    const templates = localStorage.getItem("templates");
    const newTemplates = templates ? [...JSON.parse(templates)] : [];
    const existingTemplate = newTemplates.find((t: any) => t.id === templateId);
    if (!existingTemplate) newTemplates.push(rootBlock);
    else {
      existingTemplate.name = rootBlock.name;
      existingTemplate.options = rootBlock.options;
      existingTemplate.blocks = rootBlock.blocks;
    }
    localStorage?.setItem("templates", JSON.stringify(newTemplates));
  }

  // load template
  useEffect(() => {
    if (templateId !== "new") {
      const templates = localStorage.getItem("templates");
      if (templates) {
        const template = JSON.parse(templates).find((t: any) => t.id === templateId);
        setRootBlock(template);
        setSelectedBlock(template);
      } else setRootBlock({ ...newBlock(), name: "Template" });
    } else {
      setRootBlock({ ...newBlock(), name: "Template" });
    }
  }, [templateId]);

  return (
    <div className={styles.wrapper}>
      <h1 style={{ marginBottom: 20 }}>Composer</h1>
      <div className={styles.header}>
        <Link href="/" style={{ marginRight: 20 }}>
          Home
        </Link>
        <button onClick={saveTemplate}>Save template</button>
      </div>
      {rootBlock && (
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <BlockTree
              block={rootBlock}
              position=""
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
            />
            {selectedBlock && (
              <BlockSettings
                block={selectedBlock}
                parent={findParent(selectedBlock.id, rootBlock)}
                addBlock={addBlock}
                editBlock={editBlock}
                deleteBlock={deleteBlock}
              />
            )}
          </div>
          <div className={styles.canvas}>
            <Block
              block={rootBlock}
              depth={0}
              addBlock={addBlock}
              editBlock={editBlock}
              selectedBlock={selectedBlock}
              setSelectedBlock={setSelectedBlock}
              setDragging={setDragging}
              setDragPosition={setDragPosition}
              setDragState={setDragState}
            />
            {dragging && (
              <div
                className={styles.dragLayer}
                style={{
                  top: dragPosition.y - dragState.yOffset,
                  left: dragPosition.x - dragState.xOffset,
                  width: dragState.width,
                  height: dragState.height,
                }}
              >
                <BlockPreview block={selectedBlock} depth={4} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

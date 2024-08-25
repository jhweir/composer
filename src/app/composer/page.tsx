"use client";

import BlockPreview from "@/app/components/BlockPreview/BlockPreview";
import BlockSettings from "@/app/components/BlockSettings/BlockSettings";
import BlockTree from "@/app/components/BlockTree/BlockTree";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Block from "../components/Block/Block";
import styles from "./page.module.scss";

function newBlock() {
  return {
    id: uuidv4(),
    name: "",
    options: {
      span: { x: 1, y: 1 },
      grid: { x: 2, y: 2, flow: "Vertical", gap: 0, padding: 0 },
    },
    type: "we://collection", // 'we://image', 'we://audio' etc.
    depth: 0,
    blocks: [],
  };
}

export default function Composer() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("templateId");
  const [rootBlock, setRootBlock] = useState({
    ...newBlock(),
    name: "Template",
  });
  const [selectedBlock, setSelectedBlock] = useState(rootBlock);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState({
    width: 0,
    height: 0,
    xOffset: 0,
    yOffset: 0,
  });
  const [dragging, setDragging] = useState(false);

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

  function addBlock(parentId: string) {
    const newRootBlock = { ...rootBlock };
    const parentBlock = findBlock(parentId, newRootBlock);
    parentBlock.blocks.push(newBlock());
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
      }
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
                pointerEvents: "none",
                zIndex: 1000,
              }}
            >
              <BlockPreview block={selectedBlock} depth={4} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import BlockSettings from "@/app/components/BlockSettings/BlockSettings";
import BlockTree from "@/app/components/BlockTree/BlockTree";
import Link from "next/link";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Block from "../../components/Block/Block";
import styles from "./page.module.scss";

function newBlock() {
  return {
    id: uuidv4(),
    name: "",
    options: { direction: "row", size: "1/1" },
    type: "we://collection", // 'we://image', 'we://audio' etc.
    blocks: [],
  };
}

export default function TemplateBuilder(props: { params: any }) {
  const { templateId } = props.params;
  const [rootBlock, setRootBlock] = useState(newBlock());
  const [selectedBlock, setSelectedBlock] = useState(newBlock());

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

  function editBlock(blockId: string, options: any) {
    const newRootBlock = { ...rootBlock };
    const block = findBlock(blockId, newRootBlock);
    block.options = options;
    setRootBlock(newRootBlock);
  }

  function deleteBlock(blockId: string) {
    const newRootBlock = { ...rootBlock };
    const parent = findParent(blockId, newRootBlock);
    parent.blocks = parent.blocks.filter((b: any) => b.id !== blockId);
    setRootBlock(newRootBlock);
  }

  function saveTemplate() {
    const localTemplates = localStorage.getItem("templates");
    const newTemplates = localTemplates ? [...JSON.parse(localTemplates)] : [];
    const existingTemplate = newTemplates.find((t: any) => t.id === templateId);
    if (!existingTemplate) newTemplates.push(rootBlock);
    else {
      existingTemplate.options = rootBlock.options;
      existingTemplate.blocks = rootBlock.blocks;
    }
    localStorage?.setItem("templates", JSON.stringify(newTemplates));
  }

  // load template
  useEffect(() => {
    if (templateId !== "new") {
      const localTemplates = localStorage.getItem("templates");
      if (localTemplates) {
        const template = JSON.parse(localTemplates).find(
          (t: any) => t.id === templateId
        );
        setRootBlock(template);
        setSelectedBlock(template);
      }
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1 style={{ marginBottom: 20 }}>Template builder</h1>
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
            position="Template"
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
          />
        </div>
      </div>
    </div>
  );
}

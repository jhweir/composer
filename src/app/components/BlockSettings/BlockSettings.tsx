"use client";

import { SpiralArrow } from "../../svgs";
import DropDown from "../DropDown/DropDown";
import NumberInput from "../NumberInput/NumberInput";
import TextInput from "../TextInput/TextInput";
import styles from "./BlockSettings.module.scss";

export default function BlockSettings(props: {
  block: any;
  parent: any;
  addBlock: (parentId: string) => void;
  editBlock: (blockId: string, setting: string, value: any) => void;
  deleteBlock: (blockId: string) => void;
}) {
  const { block, parent, addBlock, editBlock, deleteBlock } = props;
  const { id, name, options } = block;
  const { area, grid } = options;

  return (
    <div className={styles.wrapper}>
      <h1>Block settings</h1>
      <TextInput
        title="Name"
        value={name}
        onChange={(value: string) => editBlock(id, "name", value)}
      />
      {!!parent && (
        <button onClick={() => deleteBlock(id)} className={styles.newBlockButton}>
          Delete block
        </button>
      )}
      {!!parent && (
        <>
          <p>Block size:</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <NumberInput
              title="Horizontal span"
              value={area.x2 - area.x}
              min={1}
              max={24}
              onChange={(value: number) => {
                const newOptions = { ...options };
                newOptions.area.x2 = newOptions.area.x + value;
                editBlock(id, "options", newOptions);
              }}
            />
            <p>x</p>
            <NumberInput
              title="Vertical span"
              value={area.y2 - area.y}
              min={1}
              max={24}
              onChange={(value: number) => {
                const newOptions = { ...options };
                newOptions.area.y2 = newOptions.area.y + value;
                editBlock(id, "options", newOptions);
              }}
            />
          </div>
        </>
      )}
      <div className={styles.innerSettings}>
        <h2>Children</h2>
        <button onClick={() => addBlock(id)} className={styles.newBlockButton}>
          Add child block
        </button>

        <div style={{ display: "flex", gap: "20px" }}>
          <NumberInput
            title="Horizontal"
            value={grid.width}
            min={1}
            max={24}
            onChange={(value: number) => {
              const newOptions = { ...options };
              newOptions.grid.width = value;
              editBlock(id, "options", newOptions);
            }}
          />
          <p>x</p>
          <NumberInput
            title="Vertical"
            value={grid.height}
            min={1}
            max={24}
            onChange={(value: number) => {
              const newOptions = { ...options };
              newOptions.grid.height = value;
              editBlock(id, "options", newOptions);
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <DropDown
            title="Flow"
            options={["Horizontal", "Vertical"]}
            selectedOption={grid.flow}
            setSelectedOption={(value: string) => {
              const newOptions = { ...options };
              newOptions.grid.flow = value;
              editBlock(id, "options", newOptions);
            }}
          />
          <div
            style={{
              transform: grid.flow === "Vertical" ? "rotate(180deg)" : "rotate(90deg) scaleX(-1)",
            }}
          >
            <SpiralArrow />
          </div>
        </div>

        <NumberInput
          title="Gap"
          value={grid.gap}
          min={0}
          max={100}
          onChange={(value: number) => {
            const newOptions = { ...options };
            newOptions.grid.gap = value;
            editBlock(id, "options", newOptions);
          }}
        />

        <NumberInput
          title="Padding"
          value={grid.padding}
          min={0}
          max={100}
          onChange={(value: number) => {
            const newOptions = { ...options };
            newOptions.grid.padding = value;
            editBlock(id, "options", newOptions);
          }}
        />
      </div>
    </div>
  );
}

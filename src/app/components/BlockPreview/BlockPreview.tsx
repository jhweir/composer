"use client";

import styles from "./BlockPreview.module.scss";

export default function BlockPreview(props: { block: any; depth: number; parentBlock?: any }) {
  const { block, depth } = props;
  const { options, blocks } = block;
  const { area, grid } = options;
  const color = 255 - depth * 10;

  function findSize(totalItems: number): any {
    // calculates the pixel size of child blocks factoring the total number of items & gap size
    return `calc(${100 / totalItems}% - ${((totalItems - 1) * grid.gap) / totalItems}px)`;
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        gridRow: `${area.y} / ${area.y + area.height}`,
        gridColumn: `${area.x} / ${area.x + area.width}`,
        gridTemplateRows: `repeat(${grid.y}, ${findSize(grid.y)})`,
        gridTemplateColumns: `repeat(${grid.x}, ${findSize(grid.x)})`,
        gridAutoRows: findSize(grid.y),
        gridAutoColumns: findSize(grid.x),
        gridAutoFlow: grid.flow === "Vertical" ? "row" : "column",
        backgroundColor: `rgba(${color},${color},${color})`,
        gap: grid.gap,
        padding: grid.padding,
      }}
    >
      {blocks.map((b: any) => (
        <BlockPreview key={b.id} block={b} depth={depth + 1} />
      ))}
    </div>
  );
}

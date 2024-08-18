"use client";

import styles from "./BlockPreview.module.scss";

export default function BlockPreview(props: {
  data: any;
  depth: number;
  parentBlock?: any;
}) {
  const { data, depth, parentBlock } = props;
  const { options, blocks } = data;
  const { direction, size } = options;
  const color = 255 - depth * 10;

  function findStyle(): any {
    const blockStyle = {} as any;
    if (parentBlock) {
      const paddingOffset = parentBlock.blocks.length
        ? (10 * (parentBlock.blocks.length - 1)) / parentBlock.blocks.length
        : 0;
      if (parentBlock.options.direction === "row")
        blockStyle.width = `calc(100% / ${size[2]} - ${paddingOffset}px)`;
      else blockStyle.height = `calc(100% / ${size[2]} - ${paddingOffset}px)`;
    }
    return blockStyle;
  }

  return (
    <div
      className={styles.wrapper}
      style={{
        ...findStyle(),
        backgroundColor: `rgba(${color},${color},${color})`,
      }}
    >
      {blocks.length > 0 && (
        <div className={styles.blocks} style={{ flexDirection: direction }}>
          {blocks.map((block: any) => (
            <BlockPreview
              key={block.id}
              data={block}
              depth={depth + 1}
              parentBlock={data}
            />
          ))}
        </div>
      )}
    </div>
  );
}

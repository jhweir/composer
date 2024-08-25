"use client";

export default function NumberInput(props: {
  title: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  style?: any;
}) {
  const { title, value, min, max, onChange, style } = props;

  return (
    <div style={style}>
      <p style={{ marginRight: 10 }}>{title}:</p>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(+e.target.value)}
      />
    </div>
  );
}

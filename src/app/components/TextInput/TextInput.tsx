"use client";

export default function TextInput(props: {
  title: string;
  value: number;
  onChange: (value: string) => void;
  style?: any;
}) {
  const { title, value, onChange, style } = props;

  return (
    <div style={style}>
      <p style={{ marginRight: 10 }}>{title}:</p>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

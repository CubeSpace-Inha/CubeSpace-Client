import type { CSSProperties } from "react";
import "./Tabs.css";

type Props = { options: string[]; value: number; onChange: (index: number) => void; label?: string };

// 밑판이 고른 칸으로 미끄러지는 탭(시안 .tabs · .seg를 하나로).
export function Tabs({ options, value, onChange, label }: Props) {
  const style = { "--n": options.length, "--i": value } as CSSProperties;
  return (
    <div className="tabs" role="group" aria-label={label} style={style}>
      {options.map((option, i) => (
        <button key={option} type="button" aria-pressed={i === value} onClick={() => onChange(i)}>
          {option}
        </button>
      ))}
    </div>
  );
}

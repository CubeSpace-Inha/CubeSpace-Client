import type { CSSProperties, ReactNode } from "react";
import { CubeTop } from "./CubeTop";
import type { Pixels } from "./led";
import "./Cube.css";

type Props = {
  label: string; // 화면 읽기용 설명
  pixels: Pixels;
  x: number; // 패드 위 가운데 자리(0~1 비율)
  y: number;
  line?: string; // 윗면 테두리 색(맡은 창 색)
  selected?: boolean;
  caption?: ReactNode; // 큐브 아래 글자(이름 · 배터리)
  onClick?: () => void;
};

// 패드 위 큐브 하나. 한 변 = 패드 폭의 17.5 %(35 mm / 200 mm).
export function Cube({ label, pixels, x, y, line, selected, caption, onClick }: Props) {
  const style = { left: `${x * 100}%`, top: `${y * 100}%`, "--cube-line": line } as CSSProperties;
  return (
    <button type="button" className={selected ? "cube selected" : "cube"} style={style} aria-label={label} aria-pressed={selected} onClick={onClick}>
      <CubeTop pixels={pixels} />
      {caption && <span className="cube-caption">{caption}</span>}
    </button>
  );
}

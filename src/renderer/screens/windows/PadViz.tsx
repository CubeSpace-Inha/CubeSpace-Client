import type { CSSProperties } from "react";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { padCells, vizColor, type VizCube } from "../../model/modes";
import "./PadViz.css";

// 모드 그림 왼쪽: 패드 위 큐브 모양(앱 아이콘). size = 그림 한 변(px)
export function PadViz({ cubes, size = 116, icons = true }: { cubes: VizCube[]; size?: number; icons?: boolean }) {
  const { q, cells } = padCells(cubes, size);
  return (
    <div className="mpad" style={{ "--q": `${q}px` } as CSSProperties}>
      {cells.map((c, k) => (
        <span
          key={k}
          className="q"
          style={{ "--a": vizColor(c.app), left: `calc(50% + ${c.dx.toFixed(1)}px)`, top: `calc(50% + ${c.dy.toFixed(1)}px)` } as CSSProperties}
        >
          {icons && (c.app ? <LedIcon pixels={appIcon(c.app)} size={q - 8} /> : "?")}
        </span>
      ))}
    </div>
  );
}

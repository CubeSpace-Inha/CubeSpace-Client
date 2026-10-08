import type { CSSProperties } from "react";
import type { Rules } from "../../../shared/snapshot";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { splitRects, vizColor, type VizCube } from "../../model/modes";
import "./PcViz.css";

const pct = (v: number) => `${v * 100}%`;

// 모드 그림 오른쪽: 그 모양으로 놓으면 열리는 PC 화면
export function PcViz({ cubes, rules }: { cubes: VizCube[]; rules: Rules }) {
  const R = splitRects(cubes, rules);
  return (
    <div className="mpc">
      <div className="mscr">
        {cubes.map((c, k) => {
          const [x, y, w, h] = R[k]!;
          return (
            <div key={k} className="mw" style={{ "--a": vizColor(c.app), left: pct(x), top: pct(y), width: pct(w), height: pct(h) } as CSSProperties}>
              <div>
                {c.app && <LedIcon pixels={appIcon(c.app)} size={20} />}
                <span>{c.app ?? "? 고르는 창"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

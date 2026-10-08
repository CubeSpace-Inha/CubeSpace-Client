import { useState, type CSSProperties } from "react";
import type { Mode, ModeCube, Rules } from "../../../shared/snapshot";
import { Button } from "../../components/Button";
import { SectionTitle } from "../../components/SectionTitle";
import { TextInput } from "../../components/TextInput";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { cellXy, GX, GY, toCells, vizColor, type GridCell } from "../../model/modes";
import { MAX_ON, PROGRAMS } from "../../model/windows";
import { PcViz } from "./PcViz";
import "./PickList.css";
import "./ModeEditor.css";

type Props = {
  mode?: Mode; // 없으면 새 모드
  rules: Rules;
  onSave: (name: string, cubes: ModeCube[]) => void;
  onCancel: () => void;
  onFull: () => void; // 칸이 다 찼는데 빈 칸을 눌렀을 때
};

// 모드 만들기 · 편집(시안 medHtml): 6 × 4 격자에 큐브를 놓고 칸마다 열 프로그램을 고른다. 오른쪽은 열릴 화면.
export function ModeEditor({ mode, rules, onSave, onCancel, onFull }: Props) {
  const [name, setName] = useState(mode?.name ?? "");
  const [cells, setCells] = useState<GridCell[]>(() => (mode ? toCells(mode) : []));
  const [at, setAt] = useState<[number, number] | null>(null);
  const cellAt = (x: number, y: number) => cells.find((c) => c.gx === x && c.gy === y);
  const cubes = cells.map(cellXy);
  const n = cells.length;
  const ok = n >= 2;

  const tap = (x: number, y: number) => {
    if (!cellAt(x, y) && n >= MAX_ON) return onFull();
    setAt(at && at[0] === x && at[1] === y ? null : [x, y]);
  };
  const put = (app: string | null) => {
    if (!at) return;
    const [x, y] = at;
    const h = cellAt(x, y);
    const rest = cells.filter((c) => c !== h);
    setCells(app ? [...rest, { gx: x, gy: y, app }] : rest);
    setAt(null);
  };

  let picker = null;
  if (at) {
    const [x, y] = at;
    const h = cellAt(x, y);
    const pos = y < 2 ? { top: 10 + (y + 1) * 51 } : { bottom: 219 - (10 + y * 51) + 4 };
    picker = (
      <div className="cpk mpick" style={{ left: Math.min(10 + x * 51, 121), ...pos }} role="group" aria-label="이 자리에 열 프로그램">
        {h && (
          <button type="button" className="mx" onClick={() => put(null)}>
            ✕ 큐브 빼기
          </button>
        )}
        <small>이 자리에 열 프로그램</small>
        {PROGRAMS.map((a) => (
          <button key={a} type="button" className={h?.app === a ? "on" : undefined} onClick={() => put(a)}>
            <LedIcon pixels={appIcon(a)} size={20} />
            <span>{a}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="med">
      <SectionTitle hint={`칸을 눌러 큐브를 놓고 열 프로그램을 고르세요 · 최대 ${MAX_ON}개`}>{mode ? "모드 편집" : "새 모드"}</SectionTitle>
      <div className="medr">
        <div className="mgw">
          <div className={n >= MAX_ON ? "mgrid full" : "mgrid"}>
            {Array.from({ length: GX * GY }, (_, k) => {
              const [x, y] = [k % GX, Math.floor(k / GX)];
              const c = cellAt(x, y);
              const sel = at?.[0] === x && at[1] === y;
              return (
                <button
                  key={k}
                  type="button"
                  className={[c && "on", sel && "at"].filter(Boolean).join(" ") || undefined}
                  style={c ? ({ "--a": vizColor(c.app) } as CSSProperties) : undefined}
                  title={c ? `${c.app} · 눌러서 바꾸기` : "큐브 놓기"}
                  onClick={() => tap(x, y)}
                >
                  {c ? <LedIcon pixels={appIcon(c.app)} size={30} /> : "+"}
                </button>
              );
            })}
          </div>
          {picker}
        </div>
        <div className="mside">
          {n ? (
            <PcViz cubes={cubes} rules={rules} />
          ) : (
            <div className="mpc">
              <div className="mscr mph">
                칸에 큐브를 놓으면
                <br />
                열릴 화면이 여기 보여요
              </div>
            </div>
          )}
          <div className="mshape">{ok ? `큐브 ${n}개 · 이 모양으로 놓으면 위 화면이 열려요` : `큐브 ${n}개 · 2개 이상 놓아 주세요`}</div>
          <div className="msave">
            <TextInput placeholder="모드 이름" aria-label="모드 이름" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={onCancel}>취소</Button>
            <Button variant="primary" disabled={!ok} onClick={() => onSave(name.trim(), cubes)}>
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

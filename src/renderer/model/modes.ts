import { fitMode } from "../../shared/modeFit";
import type { Mode, ModeCube, Rules, Snapshot } from "../../shared/snapshot";
import { APP_ICONS } from "../cube/appIcons";
import { onPad, PAD_H, PAD_W, winOf } from "./home";

// 스냅샷 → 창 화면 모드 카드에 그릴 값. 시안 pad-home.html의 modeBody · padViz · pcViz · calc · medHtml 규칙.

export type VizCube = { xy: [number, number]; app: string | null }; // app null = 아직 안 묶인 큐브(?)

export const vizColor = (app: string | null) =>
  app ? (APP_ICONS[app]?.palette[0] ?? "#9aa1ad") : "#9aa1ad";

// 패드 그림: 36mm 칸에 맞춰 모양만 가운데에 그린다. size = 그림 한 변(px)
export function padCells(list: VizCube[], size = 116) {
  const xs = list.map((c) => Math.round(c.xy[0] / 36));
  const ys = list.map((c) => Math.round(c.xy[1] / 36));
  const [mx, my] = [Math.min(...xs), Math.min(...ys)];
  const w = Math.max(...xs) - mx + 1;
  const h = Math.max(...ys) - my + 1;
  const z = Math.min(32, size / Math.max(w, h));
  return {
    q: z - 4,
    cells: list.map((c, k) => ({
      ...c,
      dx: (xs[k]! - mx - w / 2) * z + 2,
      dy: (ys[k]! - my - h / 2) * z + 2,
    })),
  };
}

// 화면 나누기(시안 calc): 큐브 위치와 규칙으로 창 사각형 [x, y, w, h](0~1)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export function splitRects(
  list: VizCube[],
  rules: Rules,
): [number, number, number, number][] {
  const a = list.map((c, i) => ({
    i,
    nx: c.xy[0] / PAD_W,
    ny: c.xy[1] / PAD_H,
  }));
  const n = a.length;
  const by = (k: "nx" | "ny") => [...a].sort((p, q) => p[k] - q[k]);
  const R: [number, number, number, number][] = [];
  if (n === 1) R[0] = [0, 0, 1, 1];
  if (n === 2) {
    const [l, r] = by("nx") as [(typeof a)[0], (typeof a)[0]];
    const m =
      rules.split2 === "half" ? 0.5 : clamp((l.nx + r.nx) / 2, 0.3, 0.7);
    R[l.i] = [0, 0, m, 1];
    R[r.i] = [m, 0, 1 - m, 1];
  }
  if (n > 2 && (n === 3 ? rules.split3 : rules.split4) === "col")
    by("nx").forEach((c, k) => (R[c.i] = [k / n, 0, 1 / n, 1]));
  else if (n === 3) {
    const [l, ...rs] = by("nx") as [
      (typeof a)[0],
      (typeof a)[0],
      (typeof a)[0],
    ];
    const [t, b] = rs.sort((p, q) => p.ny - q.ny) as [
      (typeof a)[0],
      (typeof a)[0],
    ];
    const m = clamp((l.nx + (t.nx + b.nx) / 2) / 2, 0.3, 0.7);
    const my = clamp((t.ny + b.ny) / 2, 0.3, 0.7);
    R[l.i] = [0, 0, m, 1];
    R[t.i] = [m, 0, 1 - m, my];
    R[b.i] = [m, my, 1 - m, 1 - my];
  } else if (n === 4) {
    const s = by("ny");
    const [t0, t1] = s.slice(0, 2).sort((p, q) => p.nx - q.nx) as [
      (typeof a)[0],
      (typeof a)[0],
    ];
    const [b0, b1] = s.slice(2).sort((p, q) => p.nx - q.nx) as [
      (typeof a)[0],
      (typeof a)[0],
    ];
    const my = clamp((t0.ny + t1.ny + b0.ny + b1.ny) / 4, 0.3, 0.7);
    const mt = clamp((t0.nx + t1.nx) / 2, 0.3, 0.7);
    const mb = clamp((b0.nx + b1.nx) / 2, 0.3, 0.7);
    R[t0.i] = [0, 0, mt, my];
    R[t1.i] = [mt, 0, 1 - mt, my];
    R[b0.i] = [0, my, mb, 1 - my];
    R[b1.i] = [mb, my, 1 - mb, 1 - my];
  }
  return R;
}

// 지금 패드: 패드 위 큐브와 묶인 창의 앱
export const nowCubes = (s: Snapshot): VizCube[] =>
  s.cubes
    .filter(onPad)
    .map((c) => ({ xy: c.xy!, app: winOf(s, c)?.app ?? null }));

export const sameShape = (
  s: Snapshot,
  list: { xy: [number, number] }[],
  skip?: string,
): Mode | undefined =>
  list.length >= 2
    ? s.modes.find(
        (m) => m.id !== skip && fitMode(list, m.cubes, s.settings.rules.gapMm),
      )
    : undefined;

// 지금 패드 카드: 실행 중인 모드 · 저장할 수 있는지 · 모양이 같은 모드(덮어쓰기)
export function nowCard(s: Snapshot) {
  const cubes = nowCubes(s);
  const cur = s.modes.find((m) => m.id === s.activeMode);
  const canSave = cubes.length >= 2 && cubes.every((c) => c.app);
  return {
    cubes,
    cur,
    canSave,
    same: sameShape(s, cubes),
    status: cur
      ? `'${cur.name}' 모드 실행 중`
      : cubes.length
        ? `큐브 ${cubes.length}개 · 저장된 모드 아님`
        : "올린 큐브 없음",
  };
}

// 모드 만들기 격자: 6 × 4칸, 한 칸 = 36mm(큐브 35mm + 틈). 패드 가운데 기준.
export const GX = 6;
export const GY = 4;
export type GridCell = { gx: number; gy: number; app: string };
export const cellXy = (g: GridCell): ModeCube => ({
  xy: [
    PAD_W / 2 + (g.gx - (GX - 1) / 2) * 36,
    PAD_H / 2 + (g.gy - (GY - 1) / 2) * 36,
  ],
  app: g.app,
});
export const toCells = (m: Mode): GridCell[] =>
  m.cubes.map((c) => ({
    app: c.app,
    gx: clamp(Math.round((c.xy[0] - PAD_W / 2) / 36 + (GX - 1) / 2), 0, GX - 1),
    gy: clamp(Math.round((c.xy[1] - PAD_H / 2) / 36 + (GY - 1) / 2), 0, GY - 1),
  }));

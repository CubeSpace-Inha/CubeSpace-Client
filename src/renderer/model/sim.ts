import type { Cube, Snapshot } from "../../shared/snapshot";
import { outlineLeds, type PadLed, type Pixels } from "../cube/led";
import {
  AI,
  cubeLine,
  cubePixels,
  homeView,
  onPad,
  profOf,
  REGION,
  winOf,
} from "./home";
import { winTitle } from "./windows";

// 스냅샷 → 시뮬레이션 화면에 그릴 값. 시안 frame1.html의 sim(패드 · 큐브 배정 · PC 창 결과 · 최근 기록) 규칙.

export type LedMode = "windows" | "ai";
export const LED_MODES = [
  ["windows", "창 모드 LED", "창마다 다른 색의 경계"],
  ["ai", "AI 모드 LED", "AI 구성 · 보라색 테두리"],
] as const;

// 패드 LED: 창 모드는 홈과 같은 창 영역 테두리, AI 모드는 패드 가장자리 전체를 보라로
export const simLeds = (s: Snapshot, mode: LedMode): PadLed[] =>
  mode === "ai" ? outlineLeds([0, 0, 1, 1], AI, 0.8) : homeView(s).leds;

// 패드 아래 칸: 슬롯 6개. 패드 밖에 있는 큐브만 칸에 있다(패드 위면 빈 칸).
export type TrayCell = {
  slot: number;
  name: string;
  cube?: { pixels: Pixels; line?: string; off: boolean; asg: Assign };
};
export function trayCells(s: Snapshot): TrayCell[] {
  return Array.from({ length: 6 }, (_, slot) => {
    const c = s.cubes.find((x) => x.slot === slot);
    if (!c) return { slot, name: "—" };
    if (onPad(c)) return { slot, name: c.name };
    return {
      slot,
      name: c.name,
      cube: {
        pixels: cubePixels(s, c),
        line: cubeLine(s, c),
        off: c.link === "down",
        asg: assignOf(s, c),
      },
    };
  });
}

// 큐브 배정: 큐브가 맡은 창 · AI 구성(패드 위 큐브 아래 · 슬롯 칸에 적는다)
export type Assign = { win: string; ai: string };
export const assignOf = (s: Snapshot, c: Cube): Assign => ({
  win: winOf(s, c)?.app ?? "연결 없음",
  ai: profOf(s, c)?.name ?? "연결 없음",
});

// 창 속 흉내 그림 종류(시안 PROGS)
export type WinKind = "code" | "web" | "term" | "doc" | "vid" | "chat";
const KIND: Record<string, WinKind> = {
  "VS Code": "code",
  "Visual Studio": "code",
  "IntelliJ IDEA": "code",
  PyCharm: "code",
  "Android Studio": "code",
  Edge: "web",
  Chrome: "web",
  Firefox: "web",
  "Windows Terminal": "term",
  "Claude CLI": "term",
  YouTube: "vid",
  Netflix: "vid",
  Twitch: "vid",
  VLC: "vid",
  카카오톡: "chat",
  Discord: "chat",
  Slack: "chat",
  Telegram: "chat",
  WhatsApp: "chat",
  Teams: "chat",
};
export const winKind = (app: string): WinKind => KIND[app] ?? "doc";

// PC 화면의 창: 배치(사각형)마다 하나. 색은 영역 색, 꼬리표는 맡은 큐브 이름.
export type SimWindow = {
  id: string;
  left: string;
  top: string;
  width: string;
  height: string;
  color: string;
  title: string;
  tag?: string;
  kind: WinKind;
};
export function simWindows(s: Snapshot): SimWindow[] {
  return s.layout.flatMap((p, i) => {
    const w = s.windows.find((x) => x.id === p.window);
    if (!w || w.status === "minimized") return [];
    const [x0, y0, x1, y1] = p.rect;
    const pct = (v: number) => `${v * 100}%`;
    return [
      {
        id: w.id,
        left: pct(x0),
        top: pct(y0),
        width: pct(x1 - x0),
        height: pct(y1 - y0),
        color: REGION[i]!,
        title: winTitle(w),
        tag: s.cubes.find((c) => c.window === w.id)?.name,
        kind: winKind(w.app),
      },
    ];
  });
}

export function pillText(s: Snapshot): string {
  if (s.pad.session !== "up") return "패드 연결 끊김";
  return `패드 연결됨 · 큐브 ${s.cubes.filter(onPad).length}/4`;
}

// 최근 기록 한 줄(시안 log). 앞 스냅샷과 비교해 바뀐 것만 만든다.
export type SimEvent = { text: string; color?: string; err?: boolean };
export function simEvents(prev: Snapshot, next: Snapshot): SimEvent[] {
  const out: SimEvent[] = [];
  if (prev.pad.session !== next.pad.session)
    out.push(
      next.pad.session === "up"
        ? { text: "패드 다시 연결됨" }
        : { text: "패드 연결 끊김", err: true },
    );
  for (const c of next.cubes) {
    const p = prev.cubes.find((x) => x.slot === c.slot);
    const color = cubeLine(next, c);
    const app = winOf(next, c)?.app;
    if (!p) out.push({ text: `큐브 ${c.name} 등록됨`, color });
    else if (!onPad(p) && onPad(c))
      out.push({
        text: app
          ? `큐브 ${c.name} 배치 · ${app} 창 열림`
          : `큐브 ${c.name} 배치 · 연결된 창 없음`,
        color,
      });
    else if (onPad(p) && !onPad(c))
      out.push({ text: `큐브 ${c.name} 제거`, color: cubeLine(prev, p) });
    else if (p.window !== c.window)
      out.push({
        text: app
          ? `큐브 ${c.name} · ${app} 창으로 바꿈`
          : `큐브 ${c.name} · 창 연결 해제`,
        color,
      });
  }
  for (const p of prev.cubes)
    if (!next.cubes.some((c) => c.slot === p.slot))
      out.push({ text: `큐브 ${p.name} 등록 해제` });
  return out;
}

// 처음 기록: 지금 패드 위 큐브
export function startEvent(s: Snapshot): SimEvent {
  const on = s.cubes.filter(onPad).map((c: Cube) => c.name);
  return {
    text: on.length
      ? `시뮬레이션 시작 · 큐브 ${on.join(", ")} 배치됨`
      : "시뮬레이션 시작",
  };
}

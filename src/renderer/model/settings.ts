import type { Cube, Slot, Snapshot } from "../../shared/snapshot";
import { ICON_ROWS, REG_ICONS, toPixels, type Pixels } from "../cube/led";
import { place } from "./home";
import { battText, linkText } from "./status";
import { PROGRAMS } from "./windows";

// 스냅샷 → 설정 화면에 그릴 값. 시안 pad-home.html의 pairBody · renderSetView, 창 보기(3)의 rulesBody · progBody · stBody 규칙.

export const SLOTS = [0, 1, 2, 3, 4, 5] as const satisfies readonly Slot[];
export const freeSlot = (s: Snapshot) =>
  SLOTS.find((i) => !s.cubes.some((c) => c.slot === i));

// 장치 추가 단계: 패드 연결 → 큐브 등록 → 위치 확인
export type PairPhase = "idle" | "scan" | "found" | "locate" | "done";
export const PAIR_STEPS = ["패드 연결", "큐브 등록", "위치 확인"];
export function pairStep(s: Snapshot, phase: PairPhase): number {
  if (s.pad.session !== "up") return 0;
  if (phase === "idle") return 1;
  return phase === "scan" || phase === "found" ? 2 : 3;
}

// 등록 아이콘(시안 miniLed: 켠 점은 고른 색)
const SEL = "var(--sel)";
export const regPixels = (icon: string): Pixels =>
  toPixels(REG_ICONS[icon] ?? ICON_ROWS.frame, { "#": SEL, W: SEL });

// 등록된 큐브 한 줄의 상태 글자
export function cubeLineText(c: Cube): string {
  const l = linkText(c);
  return `${c.link === "up" ? `연결 · ${place(c)}` : `${l.text} · ${l.why}`} · ${battText(c)}`;
}

// 규칙 고르기 · 단계 값(시안 seg · stp)
export const SPLIT2 = [
  ["pos", "큐브 위치 따라"],
  ["half", "반반"],
] as const;
export const SPLIT3 = [
  ["big", "왼쪽 크게"],
  ["col", "세로 3칸"],
] as const;
export const SPLIT4 = [
  ["grid", "4칸"],
  ["col", "세로 4칸"],
] as const;
export const LIFT = [
  ["min", "최소화"],
  ["close", "닫기"],
] as const;
export const ORDER = [
  ["recent", "최근 먼저"],
  ["fav", "즐겨찾기 먼저"],
] as const;
export const BACK = { min: 0.5, max: 3, step: 0.5 };
export const MM = { min: 5, max: 30, step: 5 };

// 프로그램 목록: 검색어로 거르고, 즐겨찾기 먼저면 앞으로
export function programList(s: Snapshot, query: string): string[] {
  const q = query.trim().toLowerCase();
  const list = PROGRAMS.filter((a) => a.toLowerCase().includes(q));
  if (s.settings.rules.order !== "fav") return list;
  return [
    ...list.filter((a) => s.settings.favs.includes(a)),
    ...list.filter((a) => !s.settings.favs.includes(a)),
  ];
}

// 상태 아이콘: 큐브 LED가 상태를 알려줄 때(시안 ST_ICONS · ST_WHEN 그대로)
const ST: { name: string; when: string; palette: string[]; rows: string }[] = [
  {
    name: "연결 끊김",
    when: "패드 연결이 끊겼을 때",
    palette: ["#F0605D", "#5A6672"],
    rows: "1.1..... .1...... 1.1...22 ......22 ...22.22 ...22.22 22.22.22 22.22.22",
  },
  {
    name: "배터리 10% 미만",
    when: "배치된 창이 없고 배터리가 10% 아래일 때",
    palette: ["#8A96A3", "#E5484D"],
    rows: "........ 1111111. 12....1. 12....11 12....11 12....1. 1111111. ........",
  },
  {
    name: "배터리 25% 미만",
    when: "배치된 창이 없고 배터리가 25% 아래일 때",
    palette: ["#8A96A3", "#F5A524"],
    rows: "........ 1111111. 122...1. 122...11 122...11 122...1. 1111111. ........",
  },
  {
    name: "창 없음",
    when: "패드 위 큐브에 배치된 창이 없을 때",
    palette: ["#9AA5B1", "#D5DCE3"],
    rows: "..2111.. .21..11. .....11. ....11.. ...11... ...11... ........ ...11...",
  },
  {
    name: "창 켜짐",
    when: "아이콘이 없는 프로그램이 배치됐을 때",
    palette: ["#C9D1D9", "#F4F7FA"],
    rows: "..2211.. .2....1. 2..11..1 2.1111.1 1.1111.1 1..11..1 .1....1. ..1111..",
  },
  {
    name: "창 꺼짐",
    when: "배치된 창을 큐브 버튼으로 껐을 때",
    palette: ["#6B7885"],
    rows: "...11... .1.11.1. 1..11..1 1..11..1 1......1 1......1 .1....1. ..1111..",
  },
];
export const STATUS_ICONS = ST.map(({ name, when, palette, rows }) => ({
  name,
  when,
  pixels: toPixels(
    rows.split(" "),
    Object.fromEntries(palette.map((c, i) => [String(i + 1), c])),
  ),
}));

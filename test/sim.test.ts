import { expect, test } from "vitest";
import { OK, PAD_LOST } from "../src/renderer/dev/fixtures";
import { assignOf, pillText, simEvents, simLeds, simWindows, trayCells, winKind } from "../src/renderer/model/sim";

test("PC 창: 배치마다 하나, 사각형을 % 로, 꼬리표는 맡은 큐브", () => {
  const w = simWindows(OK);
  expect(w).toHaveLength(3);
  expect(w[0]).toMatchObject({ left: "0%", top: "0%", width: "50%", height: "100%", tag: "A", kind: "code" });
  expect(winKind("메모장")).toBe("doc");
});

test("슬롯 칸: 패드 위 큐브는 빈 칸, 패드 밖 · 도크 큐브만 놓인다", () => {
  const t = trayCells(OK);
  expect(t).toHaveLength(6);
  expect(t[0]!.cube).toBeUndefined();
  expect(t[3]!.cube?.off).toBe(false);
  expect(t[3]!.cube?.asg).toEqual({ win: "연결 없음", ai: "연결 없음" });
  expect(t[4]!.cube?.off).toBe(true);
});

test("LED: AI 모드는 패드 가장자리 전체", () => {
  expect(simLeds(OK, "ai")).toHaveLength(2 * 24 + 2 * 14);
});

test("큐브 배정과 연결 알약", () => {
  expect(assignOf(OK, OK.cubes[0]!)).toEqual({ win: "VS Code", ai: "Claude · 계획과 검토" });
  expect(assignOf(OK, OK.cubes[3]!)).toEqual({ win: "연결 없음", ai: "연결 없음" });
  expect(pillText(OK)).toBe("패드 연결됨 · 큐브 3/4");
  expect(pillText(PAD_LOST)).toBe("패드 연결 끊김");
});

test("기록: 앞 스냅샷과 달라진 것만", () => {
  expect(simEvents(OK, OK)).toEqual([]);
  expect(simEvents(OK, PAD_LOST)).toEqual([{ text: "패드 연결 끊김", err: true }]);
  const lifted = { ...OK, cubes: OK.cubes.map((c) => (c.slot === 0 ? { ...c, xy: null } : c)) };
  expect(simEvents(OK, lifted)[0]!.text).toBe("큐브 A 제거");
  expect(simEvents(lifted, OK)[0]!.text).toBe("큐브 A 배치 · VS Code 창 열림");
});

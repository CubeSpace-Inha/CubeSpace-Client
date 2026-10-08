import { expect, test } from "vitest";
import { createFakeApi } from "../src/renderer/dev/fakeApi";
import { OK, PAD_LOST } from "../src/renderer/dev/fixtures";
import { cubeLineText, freeSlot, pairStep, programList, STATUS_ICONS } from "../src/renderer/model/settings";

test("빈 슬롯: 6칸이 다 차면 없다", () => {
  expect(freeSlot(OK)).toBeUndefined();
  expect(freeSlot({ ...OK, cubes: OK.cubes.filter((c) => c.slot !== 2) })).toBe(2);
});

test("단계: 패드가 끊기면 0, 찾는 중이면 2, 확인 중이면 3", () => {
  expect(pairStep(PAD_LOST, "idle")).toBe(0);
  expect(pairStep(OK, "idle")).toBe(1);
  expect(pairStep(OK, "found")).toBe(2);
  expect(pairStep(OK, "locate")).toBe(3);
});

test("등록된 큐브 줄: 연결 · 자리 · 배터리, 꺼지면 이유", () => {
  expect(cubeLineText(OK.cubes[0]!)).toBe("연결 · 패드 위 · 82 %");
  expect(cubeLineText({ ...OK.cubes[0]!, link: "down", downReason: "dock" })).toBe("꺼짐 · 도크 · 충전 중 · 82 %");
});

test("프로그램: 검색으로 거르고, 즐겨찾기 먼저면 앞으로", () => {
  expect(programList(OK, "code")).toContain("VS Code");
  const fav = { ...OK, settings: { ...OK.settings, rules: { ...OK.settings.rules, order: "fav" as const }, favs: ["Chrome"] } };
  expect(programList(fav, "")[0]).toBe("Chrome");
});

test("상태 아이콘 6개는 8 × 8", () => {
  expect(STATUS_ICONS).toHaveLength(6);
  for (const i of STATUS_ICONS) expect(i.pixels).toHaveLength(64);
});

test("가짜 API: 등록 해제하면 맡던 창은 담당 없음, 다시 등록하면 그 슬롯에 같은 이름", async () => {
  const { api } = createFakeApi();
  await api.unregisterCube(0);
  let s = await api.getSnapshot();
  expect(s.cubes.some((c) => c.slot === 0)).toBe(false);
  expect(s.windows.some((w) => w.owner === "A")).toBe(false);
  expect(await api.registerCube()).toBe(0);
  s = await api.getSnapshot();
  expect(s.cubes[0]!.name).toBe("A");
  await api.setRules({ backSec: 2 });
  expect((await api.getSnapshot()).settings.rules.backSec).toBe(2);
});

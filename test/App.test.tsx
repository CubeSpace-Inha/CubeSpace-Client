import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test } from "vitest";
import { App } from "../src/renderer/App";
import { NAV } from "../src/renderer/layout/nav";

afterEach(cleanup);

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

test.each(NAV.map((n) => [n.path, n.label]))("%s 에서 %s 화면을 보여 주고 메뉴가 골라져 있다", (path, label) => {
  renderAt(path);
  expect(screen.getByRole("heading", { level: 1, name: label })).toBeTruthy();
  expect(screen.getByRole("button", { name: label }).getAttribute("aria-current")).toBe("page");
});

test("/ 는 메뉴 없는 페어링 화면이고, 개발 모드에서 홈으로 버튼으로 /home에 간다", () => {
  renderAt("/");
  expect(screen.getByRole("heading", { level: 1, name: "페어링" })).toBeTruthy();
  expect(screen.queryByRole("navigation", { name: "주 메뉴" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "홈으로" }));
  expect(screen.getByRole("heading", { level: 1, name: "홈" })).toBeTruthy();
});

test("메뉴를 누르면 그 화면으로 간다", () => {
  renderAt("/home");
  fireEvent.click(screen.getByRole("button", { name: "설정" }));
  expect(screen.getByRole("heading", { level: 1, name: "설정" })).toBeTruthy();
});

test("없는 경로는 홈으로 보낸다", () => {
  renderAt("/nope");
  expect(screen.getByRole("heading", { level: 1, name: "홈" })).toBeTruthy();
});

test("개발 모드에서 템플릿 보기 버튼으로 /template에 간다", () => {
  renderAt("/home");
  fireEvent.click(screen.getByRole("button", { name: "템플릿 보기" }));
  expect(screen.getByRole("heading", { name: "템플릿" })).toBeTruthy();
});

test("개발 모드에서 /template 카탈로그를 보여 준다", () => {
  renderAt("/template");
  expect(screen.getByRole("heading", { name: "템플릿" })).toBeTruthy();
});

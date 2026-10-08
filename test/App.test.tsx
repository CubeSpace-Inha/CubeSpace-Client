import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, test } from "vitest";
import { App } from "../src/renderer/App";

afterEach(cleanup);

test("/ 에서 앱 제목을 보여 준다", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "CUBE SPACE" })).toBeTruthy();
});

test("개발 모드에서 / 의 템플릿 보기 버튼으로 /template에 간다", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "템플릿 보기" }));
  expect(screen.getByRole("heading", { name: "템플릿" })).toBeTruthy();
});

test("개발 모드에서 /template 카탈로그를 보여 준다", () => {
  render(
    <MemoryRouter initialEntries={["/template"]}>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "템플릿" })).toBeTruthy();
});

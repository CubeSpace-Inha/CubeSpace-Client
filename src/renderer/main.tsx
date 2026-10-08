import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./styles/fonts.css";
import "./styles/tokens.css";
import "./styles/base.css";
import { App } from "./App";
import { createFakeApi } from "./dev/fakeApi";

// 실제 연결(preload) 전까지는 견본으로 도는 가짜 API를 쓴다.
const api = createFakeApi().api;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App api={api} />
    </BrowserRouter>
  </StrictMode>,
);

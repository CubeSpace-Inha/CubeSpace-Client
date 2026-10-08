import { Route, Routes } from "react-router";
import { TemplatePage } from "./template/TemplatePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>CUBE SPACE</h1>} />
      {/* 개발자용 템플릿 카탈로그. 배포 빌드에서는 빠진다. */}
      {import.meta.env.DEV && <Route path="/template" element={<TemplatePage />} />}
    </Routes>
  );
}

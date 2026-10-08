import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "./layout/AppLayout";
import { NAV } from "./layout/nav";
import { EmptyScreen } from "./screens/EmptyScreen";
import { PairingScreen } from "./screens/PairingScreen";
import { TemplatePage } from "./template/TemplatePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PairingScreen />} />
      <Route element={<AppLayout />}>
        {NAV.map((n) => (
          <Route key={n.path} path={n.path} element={<EmptyScreen title={n.label} />} />
        ))}
      </Route>
      {/* 개발자용 템플릿 카탈로그. 배포 빌드에서는 빠진다. */}
      {import.meta.env.DEV && (
        <Route path="/template" element={<TemplatePage />} />
      )}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

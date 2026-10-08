import { Outlet, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { AppShell } from "./AppShell";
import { NAV } from "./nav";

// 앱 틀에 주 메뉴를 경로와 묶는다. 고른 화면은 Outlet 자리에 그려진다.
export function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <AppShell
      items={NAV}
      current={NAV.findIndex((n) => n.path === pathname)}
      onSelect={(i) => navigate(NAV[i]!.path)}
    >
      <Outlet />
      {/* 디버그용: 템플릿 카탈로그로 가는 버튼. 배포 빌드에서는 빠진다. */}
      {import.meta.env.DEV && (
        <Button
          size="sm"
          style={{ position: "fixed", right: 16, bottom: 16 }}
          onClick={() => navigate("/template")}
        >
          템플릿 보기
        </Button>
      )}
    </AppShell>
  );
}

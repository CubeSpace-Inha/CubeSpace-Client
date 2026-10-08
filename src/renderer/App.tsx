import { Route, Routes, useNavigate } from "react-router";
import { Button } from "./components/Button";
import { TemplatePage } from "./template/TemplatePage";

export function App() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1>CUBE SPACE</h1>
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
          </>
        }
      />
      {/* 개발자용 템플릿 카탈로그. 배포 빌드에서는 빠진다. */}
      {import.meta.env.DEV && (
        <Route path="/template" element={<TemplatePage />} />
      )}
    </Routes>
  );
}

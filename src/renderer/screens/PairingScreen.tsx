import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Logo } from "../components/Logo";
import { Board } from "../layout/Board";

// 앱을 처음 켰을 때 패드와 페어링하는 화면(/). 메뉴 없이 뜬다. 시안이 없어 아직 로고만 둔 빈 자리.
export function PairingScreen() {
  const navigate = useNavigate();
  return (
    <Board>
      <h1 className="sr-only">페어링</h1>
      <Card title="페어링">
        <div style={{ display: "grid", justifyItems: "center", gap: 16, padding: "32px 0" }}>
          <Logo size={160} />
          준비 중
        </div>
      </Card>
      {/* 디버그용: 페어링 없이 홈으로. 배포 빌드에서는 빠진다. */}
      {import.meta.env.DEV && (
        <Button
          size="sm"
          style={{ position: "fixed", right: 16, bottom: 16 }}
          onClick={() => navigate("/home")}
        >
          홈으로
        </Button>
      )}
    </Board>
  );
}

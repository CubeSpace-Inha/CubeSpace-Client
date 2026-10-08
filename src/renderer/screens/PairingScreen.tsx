import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { EmptyScreen } from "./EmptyScreen";

// 앱을 처음 켰을 때 패드와 페어링하는 화면(/). 메뉴 없이 뜬다. 시안이 없어 아직 빈 자리.
export function PairingScreen() {
  const navigate = useNavigate();
  return (
    <>
      <EmptyScreen title="페어링" />
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
    </>
  );
}

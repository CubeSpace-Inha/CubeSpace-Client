import { useEffect, useState } from "react";
import type { CubeSpaceApi } from "../../../shared/api";
import type { Slot } from "../../../shared/snapshot";
import type { PairPhase } from "../../model/settings";

// 장치 추가 흐름(시안 pairStart · pairConfirm). 찾기 · 위치 확인은 아직 흉내만 낸다(임시): 찾기는 2.2초 뒤 하나를 찾고,
// 위치 확인 버튼을 누르면 registerCube로 등록한다. 완료 표시는 1.7초 뒤 처음으로 돌아간다.
export function usePairing(
  api: CubeSpaceApi,
  onRegistered: (slot: Slot) => void,
) {
  const [phase, setPhase] = useState<PairPhase>("idle");

  useEffect(() => {
    if (phase !== "scan" && phase !== "done") return;
    const t = setTimeout(
      () => setPhase(phase === "scan" ? "found" : "idle"),
      phase === "scan" ? 2200 : 1700,
    );
    return () => clearTimeout(t);
  }, [phase]);

  return {
    phase,
    start: () => setPhase("scan"),
    register: () => setPhase("locate"),
    confirm: () =>
      void api.registerCube().then((slot) => {
        setPhase("done");
        onRegistered(slot);
      }),
  };
}

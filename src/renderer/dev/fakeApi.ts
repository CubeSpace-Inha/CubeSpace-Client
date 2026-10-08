import type { CubeSpaceApi } from "../../shared/api";
import type { Snapshot } from "../../shared/snapshot";
import { OK } from "./fixtures";

// 장치 없이 도는 가짜 API. push로 새 상태를 보내면 구독한 화면이 바뀐다(테스트 · 시뮬레이션용).
export function createFakeApi(initial: Snapshot = OK) {
  let current = initial;
  const listeners = new Set<(s: Snapshot) => void>();

  const api: CubeSpaceApi = {
    getSnapshot: () => Promise.resolve(current),
    onSnapshot(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  function push(next: Snapshot) {
    current = next;
    for (const l of listeners) l(next);
  }

  return { api, push };
}

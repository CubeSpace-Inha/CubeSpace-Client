import type { Snapshot } from "./snapshot";

// 화면 ↔ main 경계. 화면은 이 인터페이스로만 상태를 받는다.
// 지금은 견본으로 도는 가짜(renderer/dev/fakeApi.ts)만 있다. preload 연결은 main 쪽이 생길 때 붙인다.
// 조작(배정 · 설정 바꾸기 등)은 화면을 옮기면서 필요한 것만 더한다.
export type CubeSpaceApi = {
  getSnapshot(): Promise<Snapshot>;
  onSnapshot(listener: (s: Snapshot) => void): () => void; // 돌려받은 함수로 구독을 끊는다
};

import { useState } from "react";
import type { Snapshot } from "../../../shared/snapshot";
import type { LogItem } from "../../components/LogList";
import { simEvents, startEvent } from "../../model/sim";

const MAX = 3; // 시안처럼 최근 3줄만
const now = () => new Date().toTimeString().slice(0, 8);

// 최근 기록: 스냅샷이 바뀌면 앞 것과 비교해 새 줄을 위에 붙인다. 화면을 벗어나면 지워진다.
export function useSimLog(s: Snapshot): LogItem[] {
  const [log, setLog] = useState(() => ({ prev: s, next: 1, items: [{ id: 0, time: now(), ...startEvent(s) }] as LogItem[] }));
  if (log.prev !== s) {
    const added = simEvents(log.prev, s).reverse().map((e, i) => ({ id: log.next + i, time: now(), ...e }));
    setLog({ prev: s, next: log.next + added.length, items: [...added, ...log.items].slice(0, MAX) });
  }
  return log.items;
}

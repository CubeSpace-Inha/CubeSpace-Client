import "./MonitorSwitch.css";

type Props = { label: string; onPrev: () => void; onNext: () => void };

// ◀ 모니터 이름 ▶ (시안 .monsw)
export function MonitorSwitch({ label, onPrev, onNext }: Props) {
  return (
    <div className="monsw">
      <button type="button" aria-label="이전 모니터" onClick={onPrev}>◀</button>
      <span>{label}</span>
      <button type="button" aria-label="다음 모니터" onClick={onNext}>▶</button>
    </div>
  );
}

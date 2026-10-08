import { Card } from "../components/Card";
import { Board } from "../layout/Board";

// 아직 옮기지 않은 화면 자리. 4단계에서 화면마다 바꾼다.
export function EmptyScreen({ title }: { title: string }) {
  return (
    <Board>
      <h1 className="sr-only">{title}</h1>
      <Card title={title}>준비 중</Card>
    </Board>
  );
}

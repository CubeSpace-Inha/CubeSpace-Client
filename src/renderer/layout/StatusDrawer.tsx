import type { Snapshot } from "../../shared/snapshot";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { CodeChip } from "../components/CodeChip";
import { Drawer } from "../components/Drawer";
import { Rows } from "../components/Rows";
import { winDot } from "../model/home";
import { noticeText, WIN_TEXT, winName } from "../model/status";

const DOT = { ok: "rgb(34 197 94)", warn: "rgb(245 158 11)", neutral: "rgb(150 158 172)", muted: "rgb(154 161 173)" };

type Props = { snapshot: Snapshot; open: boolean; onClose: () => void };

// 상태 서랍: 알림 종 · 연결 체인을 누르면 연다. 패드 · 알림 · 창 연결 · 최근 오류. 시안 renderDrawer 그대로.
export function StatusDrawer({ snapshot: s, open, onClose }: Props) {
  const padUp = s.pad.session === "up";
  const connected = s.cubes.filter((c) => c.link === "up").length;
  return (
    <Drawer open={open} onClose={onClose} title="상태">
      <section>
        <h3>
          패드 <span>USB · BLE</span>
        </h3>
        <Rows
          items={[
            { key: "pad", dot: padUp ? DOT.ok : DOT.warn, title: "패드", value: padUp ? "USB 연결됨 · 입력원 패드" : "세션 끊김 · 판정 동결" },
            { key: "fw", dot: DOT.neutral, title: "펌웨어", value: <span className="mono">{s.pad.fw}</span> },
            { key: "bad", dot: s.pad.badSensors.length ? DOT.warn : DOT.ok, title: "불량 센서", value: s.pad.badSensors.length ? `${s.pad.badSensors.length}개` : "없음" },
            { key: "cubes", dot: DOT.ok, title: "큐브", value: <span className="num">등록 {s.cubes.length} · 연결 {connected} · 활성 배정 최대 4</span> },
          ]}
        />
      </section>
      <section>
        <h3>
          알림 <span className="num">{s.notices.length}건</span>
        </h3>
        <Rows
          items={
            s.notices.length
              ? s.notices.map((n, i) => ({ key: String(i), lead: <CodeChip code={n.code} />, title: noticeText(n, s.cubes) }))
              : [{ key: "none", title: "없음" }]
          }
        />
      </section>
      <section>
        <h3>
          창 연결 <span className="num">{s.windows.length}개</span>
        </h3>
        <Rows
          items={s.windows.map((w) => {
            const ws = WIN_TEXT[w.status];
            return {
              key: w.id,
              dot: winDot(s, w),
              title: (
                <>
                  {winName(w)}
                  {w.owner && <span className="kicker"> · 큐브 {w.owner}</span>}
                </>
              ),
              value: <Badge tone={ws.tone}>{ws.text}</Badge>,
              note: ws.note && (
                <>
                  {ws.note}
                  {w.status === "relaunchable" && <Button size="sm">다시 열기</Button>}
                </>
              ),
            };
          })}
        />
      </section>
      <section>
        <h3>최근 오류</h3>
        <Rows items={[{ key: "none", title: "없음" }]} />
      </section>
      <section>
        <Button variant="danger">기록 초기화</Button>
        <p className="note">OS 확인 창을 거친다. 진단 로그·실행 기록·CLI 대화를 지우고, 프로필·등록·로그인은 남긴다.</p>
      </section>
    </Drawer>
  );
}

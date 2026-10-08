import type { CSSProperties, ReactNode } from "react";
import type { Snapshot } from "../../../shared/snapshot";
import { Card } from "../../components/Card";
import { LogList, type LogItem } from "../../components/LogList";
import { pillText, simWindows, type WinKind } from "../../model/sim";

// 창 속 흉내 줄(시안 L(폭, 색))
const L = ({ w, k }: { w: number; k?: string }) => <i className={k ? `l ${k}` : "l"} style={{ width: `${w}%` }} />;

// 창 속 흉내 그림(시안 PROGS의 b())
const BODY: Record<WinKind, ReactNode> = {
  code: (
    <div className="m-code">
      <div className="gut">{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <div key={n}>{n}</div>)}</div>
      <div className="src">
        <L w={40} k="k" /><L w={62} /><L w={50} k="s" /><L w={30} /><L w={70} k="k" /><L w={55} /><L w={38} k="s" /><L w={60} />
      </div>
    </div>
  ),
  web: (
    <div className="m-web">
      <div className="bar" />
      <div className="hero" />
      <div className="g"><i /><i /><i /></div>
    </div>
  ),
  term: (
    <div className="m-term">
      <L w={35} k="s" /><L w={70} /><L w={52} k="k" /><L w={28} k="s" /><L w={60} /><L w={44} />
    </div>
  ),
  doc: (
    <div className="m-doc">
      <div className="h" />
      <L w={90} /><L w={82} /><L w={88} /><L w={60} /><L w={86} /><L w={40} />
    </div>
  ),
  vid: (
    <div className="m-vid">
      <b>▶</b>
      <div className="pg"><i /></div>
    </div>
  ),
  chat: (
    <div className="m-chat"><i /><i /><i /><i /></div>
  ),
};

// PC 창 결과(시안 .winmain): 창 틀 · CUBE SPACE 머리 · 모니터에 배치된 창 · 최근 기록
export function PcResult({ s, log }: { s: Snapshot; log: LogItem[] }) {
  const wins = simWindows(s);
  return (
    <Card className="winmain" n={2}>
      <div className="titlebar">
        <s /><s /><s />
        <span>PC 창 결과 — CUBE SPACE</span>
      </div>
      <div className="mh">
        <b className="brand">CUBE SPACE</b>
        <span className={s.pad.session === "up" ? "mpill" : "mpill off"}>
          <i />
          <span className="num">{pillText(s)}</span>
        </span>
      </div>
      <div className="mcont">
        <div className="monwrap">
          <div className="monitor">
            <div className="desk">
              <div className="wins">
                {wins.map((w) => (
                  <div key={w.id} className="ww" style={{ left: w.left, top: w.top, width: w.width, height: w.height, "--c": w.color } as CSSProperties}>
                    <div className="win">
                      <div className="tb">
                        <s /><s /><s />
                        <span>{w.title}</span>
                        {w.tag && <em>{w.tag}</em>}
                      </div>
                      <div className="wb">{BODY[w.kind]}</div>
                    </div>
                  </div>
                ))}
              </div>
              {!wins.length && (
                <div className="empty">
                  <div>큐브를 패드에 올리면<br />창이 열려요</div>
                </div>
              )}
              <div className="dock">
                {wins.map((w) => <i key={w.id} style={{ "--c": w.color } as CSSProperties} />)}
              </div>
            </div>
          </div>
          <div className="stand" />
          <div className="base" />
        </div>
        <div className="simlog">
          <h3>최근 기록</h3>
          <LogList items={log} />
        </div>
      </div>
    </Card>
  );
}

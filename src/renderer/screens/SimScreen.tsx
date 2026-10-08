import { useState, type CSSProperties } from "react";
import { useOutletContext } from "react-router";
import { Card } from "../components/Card";
import { Tabs } from "../components/Tabs";
import { Cube } from "../cube/Cube";
import { CubeTop } from "../cube/CubeTop";
import { Pad } from "../cube/Pad";
import type { LayoutContext } from "../layout/AppLayout";
import { Board } from "../layout/Board";
import { Column } from "../layout/Column";
import { homeView } from "../model/home";
import { assignOf, LED_MODES, simLeds, trayCells } from "../model/sim";
import { PcResult } from "./sim/PcResult";
import { useSimLog } from "./sim/useSimLog";
import "./SimScreen.css";

// 시뮬레이션(시안 frame1.html .sim): 왼쪽 패드(LED 모드 · 큐브 · 슬롯 칸, 큐브마다 맡은 창 · AI), 오른쪽 PC 창 결과 · 최근 기록.
// 큐브 끌어 놓기는 아직 없다: 놓은 자리로 창 배치를 계산하는 main 배치 엔진이 생기면 붙인다(임시로 보기만).
export function SimScreen() {
  const { snapshot: s } = useOutletContext<LayoutContext>();
  const [mode, setMode] = useState(0);
  const log = useSimLog(s);
  const v = homeView(s);

  return (
    <Board columns="minmax(340px, 440px) minmax(0, 1fr)">
      <h1 className="sr-only">시뮬레이션</h1>
      <Column>
        <Card title="패드" meta="큐브를 끌어다 놓으세요" className="padcard">
          <div className="lmode">
            <Tabs small label="패드 LED" options={LED_MODES.map((m) => m[1])} value={mode} onChange={setMode} />
            <small>{LED_MODES[mode]![2]}</small>
          </div>
          <div className="simstage">
            <Pad leds={simLeds(s, LED_MODES[mode]![0])} frozen={v.frozen}>
              {v.placed.map((p) => {
                const a = assignOf(s, p.cube);
                return (
                  <Cube
                    key={p.cube.slot}
                    slot={p.cube.slot}
                    label={p.label}
                    pixels={p.pixels}
                    x={p.x}
                    y={p.y}
                    line={p.line}
                    caption={
                      <>
                        <b>{a.win}</b>
                        <small>{a.ai}</small>
                      </>
                    }
                  />
                );
              })}
              <span className="lbl">PAD 200 × 133 mm</span>
              {v.frozen && (
                <div className="off-ov">
                  <div>
                    <b>패드 연결이 끊겼어요</b>
                    <span>다시 연결하면 큐브 위치를 이어서 사용해요</span>
                  </div>
                </div>
              )}
            </Pad>
          </div>
          <div className="tray">
            {trayCells(s).map((t) => (
              <div key={t.slot} className="tslot num">
                {t.cube && (
                  <span className={t.cube.off ? "cube off" : "cube"} style={{ "--cube-line": t.cube.line } as CSSProperties}>
                    <CubeTop pixels={t.cube.pixels} />
                  </span>
                )}
                {t.cube && (
                  <span className="tasg" title={`${t.cube.asg.win} · ${t.cube.asg.ai}`}>
                    <b>{t.cube.asg.win}</b>
                    <span>{t.cube.asg.ai}</span>
                  </span>
                )}
                <small>{t.name}</small>
              </div>
            ))}
          </div>
        </Card>
      </Column>
      <Column>
        <PcResult s={s} log={log} />
      </Column>
    </Board>
  );
}

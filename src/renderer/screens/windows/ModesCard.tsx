import { useState } from "react";
import type { CubeSpaceApi } from "../../../shared/api";
import type { Mode, ModeCube, Snapshot } from "../../../shared/snapshot";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { TextInput } from "../../components/TextInput";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { nowCard, sameShape } from "../../model/modes";
import { MAX_ON } from "../../model/windows";
import { ModeEditor } from "./ModeEditor";
import { PadViz } from "./PadViz";
import { PcViz } from "./PcViz";
import "./ModesCard.css";

type Props = { s: Snapshot; api: CubeSpaceApi; toast: (text: string) => void };

// 모드(시안 modeBody): 저장된 모드 칩 줄 · 만들기/편집 · 지금 패드(이대로 저장) · 모드 카드(편집 · 삭제).
export function ModesCard({ s, api, toast }: Props) {
  const [name, setName] = useState("");
  const [med, setMed] = useState<{ mode?: Mode } | null>(null); // 열린 편집기(mode 없으면 새 모드)
  const now = nowCard(s);
  const rules = s.settings.rules;
  const nextName = `모드 ${s.modes.length + 1}`;

  const saveNow = () => {
    const cubes = now.cubes as ModeCube[];
    const nm = name.trim() || now.same?.name || nextName;
    void api.saveMode({ id: now.same?.id, name: nm, cubes, now: true });
    toast(now.same ? `'${nm}' 모드를 바꿨어요` : `'${nm}' 모드를 저장했어요`);
    setName("");
  };
  const saveEdit = (nm: string, cubes: ModeCube[]) => {
    const m = med?.mode;
    const dup = sameShape(s, cubes, m?.id);
    if (dup) return toast(`'${dup.name}' 모드와 모양이 같아요`);
    const final = nm || m?.name || nextName;
    void api.saveMode({ id: m?.id, name: final, cubes });
    toast(m ? `'${final}' 모드를 고쳤어요` : `'${final}' 모드를 추가했어요`);
    setMed(null);
  };
  const remove = (m: Mode) => {
    void api.deleteMode(m.id);
    if (med?.mode?.id === m.id) setMed(null);
  };

  const viz = (cubes: Parameters<typeof PadViz>[0]["cubes"]) => (
    <div className="mviz">
      <PadViz cubes={cubes} />
      <span className="marr">→</span>
      <PcViz cubes={cubes} rules={rules} />
    </div>
  );

  return (
    <Card title="모드" meta={`${s.modes.length}개`} scroll n={3} className="wsec">
      <div className="mtop">
        <span>큐브를 이 모양으로 놓으면 오른쪽 화면이 바로 열려요. 어느 큐브를 써도 돼요.</span>
        <Button on={!!med && !med.mode} onClick={() => setMed(med && !med.mode ? null : {})}>
          ＋ 직접 만들기
        </Button>
      </div>
      {s.modes.length > 0 && (
        <div className="mstrip">
          {s.modes.map((m) => (
            <button
              key={m.id}
              type="button"
              className={m.id === s.activeMode ? "mchip on" : "mchip"}
              title={`${m.name} 모드 보기`}
              onClick={() => document.getElementById(`mc-${m.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" })}
            >
              <PadViz cubes={m.cubes} size={30} icons={false} />
              <b>{m.name}</b>
              <span>
                {m.cubes.map((c, k) => (
                  <LedIcon key={k} pixels={appIcon(c.app)} size={16} />
                ))}
              </span>
            </button>
          ))}
        </div>
      )}
      {med && (
        <ModeEditor
          key={med.mode?.id ?? "new"}
          mode={med.mode}
          rules={rules}
          onSave={saveEdit}
          onCancel={() => setMed(null)}
          onFull={() => toast(`패드에는 큐브를 ${MAX_ON}개까지 올릴 수 있어요`)}
        />
      )}
      <div className="mlist">
        <div className="mcard now">
          <div className="mhd">
            <b>지금 패드</b>
            <small className={now.cur ? "ok" : undefined}>{now.status}</small>
          </div>
          {now.cubes.length ? viz(now.cubes) : <div className="mempty">홈에서 큐브를 패드에 올려 보세요</div>}
          <div className="msave">
            <TextInput
              placeholder={now.same ? `'${now.same.name}' 덮어쓰기` : "모드 이름"}
              aria-label="모드 이름"
              value={name}
              disabled={!now.canSave}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && now.canSave && saveNow()}
            />
            <Button variant="primary" disabled={!now.canSave} onClick={saveNow}>
              {now.same ? "바꾸기" : "이대로 저장"}
            </Button>
          </div>
          {!now.canSave && <p className="mhint">큐브 2개 이상이 모두 창에 묶이면 지금 배치를 저장할 수 있어요</p>}
        </div>
        {s.modes.map((m) => {
          const on = m.id === s.activeMode;
          return (
            <div key={m.id} id={`mc-${m.id}`} className={on ? "mcard on" : "mcard"}>
              <div className="mhd">
                <b>{m.name}</b>
                <small className={on ? "ok" : undefined}>
                  큐브 {m.cubes.length}개{on && " · 실행 중"}
                </small>
                <button type="button" className="x" title="모드 편집" aria-label={`${m.name} 모드 편집`} onClick={() => setMed({ mode: m })}>
                  ✎
                </button>
                <button type="button" className="x del" title="모드 삭제" aria-label={`${m.name} 모드 삭제`} onClick={() => remove(m)}>
                  ✕
                </button>
              </div>
              {viz(m.cubes)}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

import { useState, type ReactNode } from "react";
import type { Rules, Snapshot } from "../../../shared/snapshot";
import { SectionTitle } from "../../components/SectionTitle";
import { Stepper } from "../../components/Stepper";
import { Switch } from "../../components/Switch";
import { Tabs } from "../../components/Tabs";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { BACK, LIFT, MM, SPLIT2, SPLIT3, SPLIT4 } from "../../model/settings";
import { PROGRAMS } from "../../model/windows";

type Props = { s: Snapshot; onChange: (patch: Partial<Rules>) => void };
const SHOW = 10; // 묶지 않을 앱: 처음 보이는 개수

// 한 줄: 왼쪽 이름(+ 설명), 오른쪽 조작
function Opt({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="ropt">
      <span>
        {title}
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </div>
  );
}

// 규칙(시안 (3) rulesBody): 화면 나누기 · 큐브를 내렸을 때 · 모드 · PC 켤 때 · 예외. 프리셋은 뺐다.
export function RulesBody({ s, onChange }: Props) {
  const r = s.settings.rules;
  const [more, setMore] = useState(false);
  const apps = [...new Set([...PROGRAMS, ...s.windows.map((w) => w.app)])];
  const seg = <K extends keyof Rules>(k: K, list: readonly (readonly [Rules[K], string])[], label: string) => (
    <Tabs
      small
      label={label}
      options={list.map(([, n]) => n)}
      value={list.findIndex(([v]) => v === r[k])}
      onChange={(i) => onChange({ [k]: list[i]![0] })}
    />
  );
  const skip = (a: string) =>
    onChange({ skipApps: r.skipApps.includes(a) ? r.skipApps.filter((x) => x !== a) : [...r.skipApps, a] });

  return (
    <>
      <SectionTitle hint="켜진 묶인 창 수에 따라">화면 나누기</SectionTitle>
      <div className="ropts">
        <Opt title="큐브 2개">{seg("split2", SPLIT2, "큐브 2개 나누기")}</Opt>
        <Opt title="큐브 3개">{seg("split3", SPLIT3, "큐브 3개 나누기")}</Opt>
        <Opt title="큐브 4개">{seg("split4", SPLIT4, "큐브 4개 나누기")}</Opt>
      </div>
      <SectionTitle>큐브를 내렸을 때</SectionTitle>
      <div className="ropts">
        <Opt title="묶인 창" hint="최소화하면 지도에 자리가 남아 다시 놓으면 올라와요">
          {seg("lift", LIFT, "묶인 창")}
        </Opt>
        <Opt title="되돌리는 시간" hint="이 시간 안에 제자리에 다시 놓으면 그대로 둬요">
          <Stepper label="되돌리는 시간" value={r.backSec} unit="초" {...BACK} onChange={(backSec) => onChange({ backSec })} />
        </Opt>
        <Opt title="제자리로 볼 거리" hint="잠깐 들었다 놓을 때 이만큼은 같은 자리">
          <Stepper label="제자리로 볼 거리" value={r.stayMm} unit="mm" {...MM} onChange={(stayMm) => onChange({ stayMm })} />
        </Opt>
      </div>
      <SectionTitle>모드</SectionTitle>
      <div className="ropts">
        <Opt title="붙어 있다고 볼 틈" hint="큐브 사이가 이만큼 떨어져도 같은 모양">
          <Stepper label="붙어 있다고 볼 틈" value={r.gapMm} unit="mm" {...MM} onChange={(gapMm) => onChange({ gapMm })} />
        </Opt>
      </div>
      <SectionTitle hint="큐브는 어제 놓인 그대로예요">PC 켤 때</SectionTitle>
      <div className="ropts">
        <Switch
          label="모드 바로 실행"
          hint="큐브가 저장된 모드 모양이면 프로그램을 열고 배치해요"
          checked={r.bootMode}
          onChange={(bootMode) => onChange({ bootMode })}
        />
      </div>
      <SectionTitle>예외</SectionTitle>
      <div className="ropts">
        <Switch
          label="항상 위 창은 묶지 않기"
          hint="유튜브 작은 창처럼 위에 떠 있는 창"
          checked={r.topSkip}
          onChange={(topSkip) => onChange({ topSkip })}
        />
        <div className="ropt col">
          <span>
            묶지 않을 앱<small>큐브를 위에 놓아도 빈 곳처럼 고르는 창이 떠요</small>
          </span>
          <div className="skips" role="group" aria-label="묶지 않을 앱">
            {apps
              .filter((a, i) => more || i < SHOW || r.skipApps.includes(a))
              .map((a) => (
                <button key={a} type="button" className={r.skipApps.includes(a) ? "on" : ""} aria-pressed={r.skipApps.includes(a)} onClick={() => skip(a)}>
                  <LedIcon pixels={appIcon(a)} size={20} />
                  {a}
                </button>
              ))}
            {apps.length > SHOW && (
              <button type="button" className="more" onClick={() => setMore(!more)}>
                {more ? "접기" : `+${apps.length - SHOW}개 더보기`}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

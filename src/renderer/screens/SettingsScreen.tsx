import { useOutletContext } from "react-router";
import { Card } from "../components/Card";
import { Toast } from "../components/Toast";
import { LedIcon } from "../cube/LedIcon";
import { useToast } from "../hooks/useToast";
import type { LayoutContext } from "../layout/AppLayout";
import { Board } from "../layout/Board";
import { Column } from "../layout/Column";
import { STATUS_ICONS } from "../model/settings";
import { PROGRAMS } from "../model/windows";
import { DeviceCard } from "./settings/DeviceCard";
import { FoldSection } from "./settings/FoldSection";
import { ProgramsBody } from "./settings/ProgramsBody";
import { RulesBody } from "./settings/RulesBody";
import "./SettingsScreen.css";

// 설정(시안 pad-home.html .setv + 창 보기(3)의 설정 쪽): 왼쪽 장치 추가 · 등록 해제, 오른쪽 규칙 · 프로그램 · 상태 아이콘.
// 프리셋은 뺐다(팀 결정). 프로그램 등록 · 아이콘 편집은 아직 옮기지 않았다.
export function SettingsScreen() {
  const { snapshot: s, api } = useOutletContext<LayoutContext>();
  const toast = useToast();

  return (
    <Board columns="minmax(0, 1fr) minmax(0, 1fr)">
      <h1 className="sr-only">설정</h1>
      <Column>
        <DeviceCard s={s} api={api} toast={toast.show} />
      </Column>
      <Column>
        <Card title="설정" meta="한 번 정해 두면 돼요" scroll n={2} className="setcard">
          <div className="setg">
            <FoldSection title="규칙">
              <RulesBody s={s} onChange={(patch) => void api.setRules(patch)} />
            </FoldSection>
            <FoldSection title="프로그램" hint={`${PROGRAMS.length}개 · ★ 즐겨찾기`}>
              <ProgramsBody s={s} onOrder={(order) => void api.setRules({ order })} />
            </FoldSection>
            <FoldSection title="상태 아이콘" hint="큐브 LED가 상태를 알려줄 때">
              <div className="progs">
                {STATUS_ICONS.map((i) => (
                  <div key={i.name} className="prog" title={i.when}>
                    <LedIcon pixels={i.pixels} size={32} />
                    <span>{i.name}</span>
                  </div>
                ))}
              </div>
            </FoldSection>
          </div>
        </Card>
      </Column>
      <Toast text={toast.text} visible={toast.visible} />
    </Board>
  );
}

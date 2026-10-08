import { useState } from "react";
import type { CubeSpaceApi } from "../../../shared/api";
import type { Slot, Snapshot } from "../../../shared/snapshot";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { SectionTitle } from "../../components/SectionTitle";
import { LedMatrix } from "../../cube/LedMatrix";
import {
  cubeLineText,
  freeSlot,
  PAIR_STEPS,
  pairStep,
  regPixels,
  SLOTS,
} from "../../model/settings";
import { usePairing } from "./usePairing";

type Props = { s: Snapshot; api: CubeSpaceApi; toast: (text: string) => void };

// 장치 추가(시안 #devCard): 단계 막대 · 슬롯 6칸(또는 찾기 · 등록 · 확인 안내) · 큰 버튼 · 등록된 큐브 목록.
// 등록 해제는 한 번 더 눌러야 한다(정말 해제).
export function DeviceCard({ s, api, toast }: Props) {
  const pair = usePairing(api, (slot) =>
    toast(`큐브 ${"ABCDEF"[slot]} 등록 완료 · 슬롯 ${slot}`),
  );
  const [arm, setArm] = useState<Slot | null>(null);
  const padUp = s.pad.session === "up";
  const slot = freeSlot(s);
  const step = pairStep(s, pair.phase);

  const unregister = (c: Snapshot["cubes"][number]) => {
    if (arm !== c.slot) return setArm(c.slot);
    setArm(null);
    void api.unregisterCube(c.slot);
    toast(`큐브 ${c.name} 등록을 해제했어요 · 슬롯 ${c.slot} 비움`);
  };

  const body = {
    scan: (
      <div className="radar">
        <i />
        <i />
        <i />
        <b />
        <small>근처 큐브를 찾는 중…</small>
      </div>
    ),
    found: (
      <div className="pairmsg">
        <span className="sock on">
          <LedMatrix pixels={regPixels("heart")} />
        </span>
        <div>
          <b>새 큐브 · …A2:F{slot}</b>
          <small>슬롯 {slot}에 등록돼요 · 다른 미등록 큐브는 꺼 두세요</small>
        </div>
      </div>
    ),
    locate: (
      <div className="pairmsg">
        <span className="hico warn">
          <Icon name="warn" size={26} stroke={2.2} />
        </span>
        <div>
          <b>큐브를 패드의 확인점에 올려 주세요</b>
          <small>위치가 정확한지 한 번 확인해요</small>
        </div>
      </div>
    ),
    done: (
      <div className="pairmsg">
        <span className="hico">
          <Icon name="ok" size={26} stroke={2.4} />
        </span>
        <div>
          <b>큐브 등록 완료</b>
          <small>이제 패드에서 사용할 수 있어요</small>
        </div>
      </div>
    ),
    idle: (
      <div className="sockets">
        {SLOTS.map((i) => {
          const c = s.cubes.find((k) => k.slot === i);
          return c ? (
            <div
              key={i}
              className="sock on"
              title={`슬롯 ${i} · 큐브 ${c.name}`}
            >
              <LedMatrix pixels={regPixels(c.icon)} />
            </div>
          ) : (
            <div key={i} className="sock vac" title={`슬롯 ${i} · 비어 있음`}>
              +
            </div>
          );
        })}
      </div>
    ),
  }[pair.phase];

  const button = {
    idle: (
      <Button
        variant="primary"
        wide
        disabled={slot === undefined || !padUp}
        onClick={pair.start}
      >
        {slot === undefined
          ? "슬롯 6개가 모두 찼어요 · 아래에서 등록을 해제하세요"
          : "큐브 등록 시작"}
      </Button>
    ),
    scan: (
      <Button variant="primary" wide disabled>
        찾는 중…
      </Button>
    ),
    found: (
      <Button variant="primary" wide onClick={pair.register}>
        이 큐브 등록하기
      </Button>
    ),
    locate: (
      <Button variant="primary" wide onClick={pair.confirm}>
        위치 확인 체험
      </Button>
    ),
    done: (
      <Button variant="primary" wide disabled>
        등록 완료
      </Button>
    ),
  }[pair.phase];

  return (
    <Card
      title="장치 추가"
      meta="슬롯 = 등록 번호 0~5"
      scroll
      className="devcard"
    >
      <p className="muted">
        패드의 전원과 USB 케이블을 연결한 뒤, 등록할 큐브를 한 번에 하나씩 켜
        주세요. <b className="num">{s.cubes.length} / 6</b>
      </p>
      <div className="steps3">
        {PAIR_STEPS.map((n, k) => (
          <span key={n} className={k < step ? "on" : ""} />
        ))}
      </div>
      <div className="stlabel">
        {PAIR_STEPS.map((n, k) => (
          <span key={n} className={k < step ? "on" : ""}>
            {n}
          </span>
        ))}
      </div>
      {body}
      {button}
      <SectionTitle hint={<span className="num">{s.cubes.length} / 6</span>}>
        등록된 큐브
      </SectionTitle>
      <ul className="lib">
        {s.cubes.map((c) => (
          <li key={c.slot}>
            <span className="lsym">
              <LedMatrix pixels={regPixels(c.icon)} />
            </span>
            <div className="lcopy">
              <small className="num">
                슬롯 {c.slot} · …{c.mac4}
              </small>
              <b>큐브 {c.name}</b>
              <span>{cubeLineText(c)}</span>
            </div>
            <Button
              size="sm"
              variant={arm === c.slot ? "danger" : "sub"}
              onClick={() => unregister(c)}
            >
              {arm === c.slot ? "정말 해제" : "등록 해제"}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

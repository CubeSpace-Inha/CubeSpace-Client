import { useState } from "react";
import type { Rules, Snapshot } from "../../../shared/snapshot";
import { Tabs } from "../../components/Tabs";
import { TextInput } from "../../components/TextInput";
import { LedIcon } from "../../cube/LedIcon";
import { appIcon } from "../../model/home";
import { ORDER, programList } from "../../model/settings";

type Props = { s: Snapshot; onOrder: (order: Rules["order"]) => void };
const SHOW = 9; // 처음 보이는 개수

// 프로그램(시안 (3) progBody): 고르는 창 순서 · 검색 · 등록된 프로그램(★ 즐겨찾기). 등록 · 편집(아이콘 그리기)은 아직 옮기지 않았다.
export function ProgramsBody({ s, onOrder }: Props) {
  const [q, setQ] = useState("");
  const [more, setMore] = useState(false);
  const list = programList(s, q);
  const shown = more || q ? list : list.slice(0, SHOW);
  const order = s.settings.rules.order;
  return (
    <>
      <div className="ropt top">
        <span>
          고르는 창 순서<small>큐브를 빈 곳에 놓았을 때 목록 위에 먼저 보일 것</small>
        </span>
        <Tabs
          small
          label="고르는 창 순서"
          options={ORDER.map(([, n]) => n)}
          value={ORDER.findIndex(([v]) => v === order)}
          onChange={(i) => onOrder(ORDER[i]![0])}
        />
      </div>
      <TextInput className="psearch" type="search" placeholder="프로그램 검색" aria-label="프로그램 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      {!list.length && <p className="pnone">'{q}'에 맞는 프로그램이 없어요</p>}
      <div className="progs">
        {shown.map((a) => (
          <div key={a} className="prog">
            {s.settings.favs.includes(a) && <i className="fav">★</i>}
            <LedIcon pixels={appIcon(a)} size={32} />
            <span>{a}</span>
          </div>
        ))}
        {!q && list.length > SHOW && (
          <button type="button" className="prog more" onClick={() => setMore(!more)}>
            {more ? "접기" : `+${list.length - SHOW}개 더보기`}
          </button>
        )}
      </div>
    </>
  );
}

// 화면이 받는 상태 한 장(스냅샷). main이 만들어 renderer에 보낸다.
// 초안(2026-10-09): 시안 pad-home.html의 견본 상태(model/snapshot.ts 후보 계약)를 바탕으로 했다.
// 필드 이름은 시안의 snake_case 대신 camelCase. "미정:" 주석은 팀이 정할 것.
// 정한 것(2026-10-09): 프리셋은 일단 뺀다 · AI 구성을 바꿔도 대화는 이어 간다 · 큐브 버튼 · 고정 프로그램은 설정에 · PC–패드는 USB · 창 배치는 사각형 목록.

// ---- 패드

export type PadSession = "up" | "lost"; // lost = PC–패드 연결 끊김: 판정을 멈추고 창 · 배정은 그대로

// PC–패드는 USB로 연결한다(패드–큐브는 무선).
export type Pad = {
  session: PadSession;
  fw: string; // 펌웨어 버전
  badSensors: number[]; // 고장 난 센서 번호
};

// ---- 큐브

export type Slot = 0 | 1 | 2 | 3 | 4 | 5; // 패드에 등록되는 큐브 자리 6칸

// 패드–큐브 무선이 끊긴 이유
export type DownReason = "link" | "dock" | "button" | "lowVolt"; // 무선 끊김 · 도크(충전 중) · 버튼으로 끔 · 저전압

export type BattLevel = "ok" | "low30" | "low10";

// 큐브 상태 기계. 문구 · 톤은 화면 쪽(renderer/model/status.ts)에서 붙인다.
export type CubeRunState =
  | "idle" // 미배정
  | "run" // 가동
  | "protected" // 보호(배정 해제 막힘)
  | "lifted" // 들림 대기: 0.5초 안에 다시 놓으면 무시
  | "recog" // 재인식 대기
  | "hold" // 끊김 보류: 5초 안에 돌아오면 담당 유지
  | "protectedAway" // 보호 부재
  | "removed"; // 제거됨: 2초 안에 다시 올리면 되돌림

export type CubeMode = "window" | "ai"; // 모드는 큐브마다

export type Cube = {
  slot: Slot;
  name: string; // A–F
  mac4: string; // MAC 뒤 4자리(구분용)
  link: "up" | "down";
  downReason?: DownReason; // link가 down일 때만
  battPct: number | null; // 못 읽으면 null
  battLevel: BattLevel;
  state: CubeRunState;
  mode: CubeMode;
  xy: [number, number] | null; // 패드 위 자리(mm). null = 패드 밖
  window: WindowId | null; // 창 모드에서 맡은 창
  icon: string; // 큐브 윗면 8 × 8 도안 키
  // 미정: AI 모드 큐브가 무엇을 맡는지(프리셋은 일단 뺐다). 구성을 바꿔도 대화는 이어 간다.
};

// ---- 창

export type WindowId = string;

export type WindowStatus =
  | "linked" // 연결됨
  | "minimized" // 최소화됨(제거됨)
  | "relaunchable" // 창은 사라졌지만 다시 열 수 있음
  | "gone" // 창 없음, 다시 열 수 없음
  | "excluded" // 관리자 권한 창이라 옮길 수 없음
  | "noResponse"; // 1초 안에 안 바뀜

export type AppWindow = {
  id: WindowId;
  app: string; // 프로그램 이름(APP_ICONS 키와 같게)
  title: string;
  owner: string | null; // 맡은 큐브 이름
  status: WindowStatus;
};

// 창 배치: rect = 조작 영역 정규화 [x0, y0, x1, y1]
// 분할 트리 대신 사각형 목록으로 정했다. 큐브를 뺐을 때 남은 창이 채우는 계산은 main 배치 엔진이 한다.
export type Placement = {
  window: WindowId;
  rect: [number, number, number, number];
};

// ---- AI 구성

export type ProfileKind = "project" | "agent" | "prompt" | "skill" | "mcp";

// 프로젝트 · 에이전트 · 지침 · 스킬 · MCP 하나
export type Profile = {
  id: string;
  kind: ProfileKind;
  name: string;
  detail: string; // 경로 · 설명 · 지침 본문
  icon: string;
  provider?: string; // agent만: Codex, Claude Code …
};

// ---- 알림

export type Notice = { code: "iconFailed"; slot: Slot } | { code: "padLost" };

// ---- 설정

export type CubeButton = "toggle" | "pick"; // 큐브 버튼: 창 켜고 끄기 · 창 고르기

// 큐브별 설정. 큐브 상태(Cube)와 따로 저장한다.
export type CubeSettings = {
  slot: Slot;
  button: CubeButton;
  fix: string | null; // 고정 프로그램(바로 열기). null = 없음
};

export type Settings = { cubes: CubeSettings[] };

// ---- 한 장

export type Snapshot = {
  pad: Pad;
  cubes: Cube[];
  windows: AppWindow[];
  layout: Placement[];
  profiles: Profile[];
  settings: Settings;
  notices: Notice[];
  monitor: { no: number; count: number }; // 창을 둘 모니터(1부터). 못 읽으면 count 0
};

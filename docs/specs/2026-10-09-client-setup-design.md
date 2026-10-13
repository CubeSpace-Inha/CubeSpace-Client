# CubeSpace-Client 기본 세팅 설계

날짜: 2026-10-09 · 상태: 승인됨

## 목적

CubeSpace 저장소의 시안 `docs/04-소프트웨어/시안/pad-home.html`을 Electron 앱으로 옮기기 전에, 빈 프로젝트 뼈대를 세운다.
다음 단계는 템플릿(토큰 · 레이아웃 · 부품)과 개발자용 카탈로그 화면 `/template`이다.

## 결정

| 항목          | 선택                                                                             | 이유                                                  |
| ------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 앱 틀         | Electron 44 + React 19 + TypeScript 6.0, Node 24                                 | 시안 HTML/CSS를 그대로 옮길 수 있다                   |
| 빌드          | electron-vite 5 (vite 7)                                                         | main · preload · renderer를 한 설정으로, renderer HMR |
| 라우팅        | react-router 8, `BrowserRouter`                                                  | `/` 앱, `/template` 카탈로그                          |
| 검사 · 테스트 | ESLint 10 + typescript-eslint, `tsc --noEmit`, Vitest 5 + Testing Library(jsdom) | `pnpm check` 하나로 lint · typecheck · test           |
| 패키지 관리자 | pnpm                                                                             | 잠금 파일 하나(`pnpm-lock.yaml`)로 설치를 맞춘다      |
| 판 고정       | 의존성은 정확한 판으로. Electron은 `^`·`~`를 쓰지 않는다                         | 모두 같은 판으로 빌드·시험한다                        |
| 저장소        | 패키지 하나                                                                      | 모노레포는 나눌 이유가 생기면 그때                    |

설계 기준은 CubeSpace 저장소 `docs/`다(구성은 `04-소프트웨어/01-구성.md`). Windows 창 제어는 C# 저장소 CubeSpace-Program-Win32가 하고, 이 앱은 `src/main/win32/`에서 그 exe를 띄우고 명령을 주고받고 감시한다. 패드 USB는 `src/main/device/`, 서버(CubeSpace-Server) 연결은 `src/main/remote/`에 둔다.

보안 골격(`webPreferences`, CSP, IPC 두 채널)은 처음부터 CubeSpace `docs/04-소프트웨어/08-동반-앱.md` 9절 규칙을 따른다.

## `/template`

- 개발 전용. `import.meta.env.DEV`일 때만 경로를 등록하고, 배포 빌드에서는 빠진다.
- 개발 서버(`http://localhost:5173/template`)라 Electron 없이 브라우저로도 볼 수 있다.
- 배포 빌드는 `file://`로 열려 `BrowserRouter` 경로가 동작하지 않는다. 패키징 단계에서 사용자 정의 프로토콜(`app://`)로 해결한다(이번 범위 밖).

## 폴더 구조

```
src/
  main/       Electron 메인(창 생성). 나중에 win32/(창 어댑터 클라이언트), device/(패드 USB), remote/(서버 연결)
  preload/    contextBridge 노출(invoke · onState 두 함수)
  shared/     main ↔ renderer 공용 타입(IPC 계약)
  core/       순수 모듈(입출력·Electron 없음): gateway/ estimate/ cube-events/ engine/ cube-replay/
  renderer/
    index.html · main.tsx · App.tsx(라우터)
    styles/ layout/ components/ hooks/ model/ screens/
    template/  TemplatePage(카탈로그)
test/         rules.test.ts(순수 모듈 규칙), vectors/(CubeSpace에서 복사한 공용 시험 벡터)
docs/
```

빈 폴더는 만들지 않는다. 파일이 생길 때 폴더도 생긴다.

## 첫 커밋 완료 조건

- `pnpm dev`로 창이 뜨고 "CUBE SPACE"가 보인다.
- `/template`에 빈 카탈로그 페이지가 있다.
- `pnpm check`(lint · typecheck · test)가 통과한다. 렌더 테스트 1개 포함.
- `.gitignore`, `README.md`(실행 방법).

## 실행 환경

Electron과 esbuild는 OS별 바이너리를 받으므로 `pnpm install` · `pnpm dev`는 Windows PowerShell에서 한다.
WSL에서 설치한 `node_modules`는 Windows에서 쓸 수 없으니 Windows에서 다시 설치한다.

/// <reference types="electron-vite/node" />
import { app, BrowserWindow, Menu } from "electron";
import { join } from "node:path";
import icon from "../../resources/icon.png?asset"; // 로고 시안 I, 창 · 작업 표시줄 아이콘

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 720,
    minHeight: 560,
    title: "CUBE SPACE",
    icon,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: true,
      contextIsolation: true,
    },
  });

  // 개발: electron-vite 개발 서버, 배포: 빌드된 파일
  const devUrl = process.env["ELECTRON_RENDERER_URL"];
  if (devUrl) {
    void win.loadURL(devUrl);
    // 기본 메뉴를 뺐으므로 개발 중에만 F12(개발자 도구) · Ctrl+R(새로고침)을 직접 단다
    win.webContents.on("before-input-event", (e, input) => {
      if (input.type !== "keyDown") return;
      if (input.key === "F12") win.webContents.toggleDevTools();
      else if (input.control && input.key.toLowerCase() === "r") win.webContents.reload();
      else return;
      e.preventDefault();
    });
  } else void win.loadFile(join(__dirname, "../renderer/index.html"));
}

void app.whenReady().then(() => {
  Menu.setApplicationMenu(null); // 창 위 File · Edit · View · Window 메뉴 막대를 없앤다
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

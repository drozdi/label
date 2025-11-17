"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const child_process = require("child_process");
const electron = require("electron");
const node_module = require("node:module");
const path = require("node:path");
const node_url = require("node:url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let serverProcess;
let tray = null;
electron.app.commandLine.appendSwitch("enable-accelerated-2d-canvas");
const gotTheLock = electron.app.requestSingleInstanceLock();
if (!gotTheLock) {
  electron.app.quit();
} else {
  async function createWindow() {
    win = new electron.BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, "icon.svg"),
      webPreferences: {
        preload: path.join(__dirname$1, "preload.mjs")
      }
    });
    win.setMenu(null);
    win.webContents.on("did-finish-load", () => {
      win?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    });
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  }
  async function createTray() {
    const iconPath = path.join(process.env.VITE_PUBLIC, "icon.png");
    tray = new electron.Tray(iconPath);
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        label: "Открыть приложение",
        click: () => {
          if (win) {
            if (win.isMinimized()) {
              win.restore();
            }
            win.show();
            win.focus();
          }
        }
      },
      {
        label: "Перезагрузить приложение",
        click: () => {
          if (win) {
            win.reload();
          }
        }
      },
      {
        label: "Выйти",
        click: () => {
          electron.app.isQuiting = true;
          electron.app.quit();
        }
      }
    ]);
    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
      if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else {
        win = electron.BrowserWindow.getAllWindows()[0];
        win.show();
      }
    });
  }
  async function startServer() {
    serverProcess = child_process.spawn("node", [path.join(process.env.APP_ROOT, "server.js")]);
    serverProcess.stdout.on("data", (data) => {
      console.log(`Сервер: ${data}`);
    });
    serverProcess.stderr.on("data", (data) => {
      console.error(`Ошибка сервера: ${data}`);
    });
    serverProcess.on("close", (code) => {
      console.log(`Сервер завершил работу с кодом ${code}`);
    });
  }
  electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      if (tray) {
        tray.displayBalloon({
          title: "Приложение свернуто",
          content: "Приложение продолжает работать в фоновом режиме."
        });
      }
    }
  });
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  electron.app.on("will-quit", () => {
    if (serverProcess) {
      serverProcess.kill();
    }
    if (tray) {
      tray.destroy();
    }
  });
  electron.app.whenReady().then(async () => {
    await startServer();
    await createTray();
    await createWindow();
  });
}
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;

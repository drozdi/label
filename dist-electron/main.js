import { app as n, BrowserWindow as l, Tray as u, Menu as w } from "electron";
import { createRequire as R } from "node:module";
import o from "node:path";
import { fileURLToPath as _ } from "node:url";
R(import.meta.url);
const r = o.dirname(_(import.meta.url));
process.env.APP_ROOT = o.join(r, "..");
const a = process.env.VITE_DEV_SERVER_URL, E = o.join(process.env.APP_ROOT, "dist-electron"), d = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = a ? o.join(process.env.APP_ROOT, "public") : d;
let e, s, i = null;
n.commandLine.appendSwitch("enable-accelerated-2d-canvas");
const g = n.requestSingleInstanceLock();
if (!g)
  n.quit();
else {
  let c = function() {
    e = new l({
      icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
      webPreferences: {
        preload: o.join(r, "preload.mjs")
      }
    }), e.setMenu(null), e.webContents.on("did-finish-load", () => {
      e?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    }), a ? e.loadURL(a) : e.loadFile(o.join(d, "index.html"));
  }, p = function() {
    const t = o.join(r, "icon.png");
    console.log(123456789, t), i = new u(t);
    const f = w.buildFromTemplate([
      {
        label: "Открыть приложение",
        click: () => {
          e && (e.isMinimized() && e.restore(), e.show(), e.focus());
        }
      },
      {
        label: "Перезагрузить приложение",
        click: () => {
          e && e.reload();
        }
      },
      {
        label: "Выйти",
        click: () => {
          n.isQuiting = !0, n.quit();
        }
      }
    ]);
    i.setContextMenu(f), i.on("click", () => {
      l.getAllWindows().length === 0 ? c() : (e = l.getAllWindows()[0], e.show());
    });
  }, m = function() {
    s = spawn("node", [o.join(r, "server.js")]), s.stdout.on("data", (t) => {
      console.log(`Сервер: ${t}`);
    }), s.stderr.on("data", (t) => {
      console.error(`Ошибка сервера: ${t}`);
    }), s.on("close", (t) => {
      console.log(`Сервер завершил работу с кодом ${t}`);
    });
  };
  n.on("window-all-closed", () => {
    process.platform !== "darwin" && i && i.displayBalloon({
      title: "Приложение свернуто",
      content: "Приложение продолжает работать в фоновом режиме."
    });
  }), n.on("activate", () => {
    l.getAllWindows().length === 0 && c();
  }), n.on("will-quit", () => {
    s && s.kill(), i && i.destroy();
  }), n.whenReady().then(() => {
    c(), p(), m();
  });
}
export {
  E as MAIN_DIST,
  d as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};

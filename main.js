const { app, BrowserWindow, Tray, Menu } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let serverProcess;
let tray = null;
let mainWindow = null;

// Аппаратное ускорение для рендеринга canvas
app.commandLine.appendSwitch("enable-accelerated-2d-canvas");

// Проверяем, является ли этот экземпляр приложения единственным
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Если это второй экземпляр, завершаем его
  app.quit();
} else {
  // Обрабатываем событие, когда второй экземпляр пытается запуститься
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore(); // Восстанавливаем окно, если оно свернуто
      mainWindow.show(); // Показываем окно
      mainWindow.focus(); // Фокусируемся на окне
    }
  });

  function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1366,
      height: 980,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
      icon: path.join(__dirname, "icon.png"),
      autoHideMenuBar: true,
    });

    mainWindow.loadURL("http://localhost:13724");
    // mainWindow.webContents.openDevTools(); // Опционально
    mainWindow.on("close", (ev) => {
      if (mainWindow?.isVisible()) {
        ev.preventDefault();
        mainWindow.hide();
      }
    });
  }

  function createTray() {
    // Указываем путь к иконке
    const iconPath = path.join(__dirname, "icon.png");
    // Создаем трей
    tray = new Tray(iconPath);

    // Создаем контекстное меню для трея
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "Открыть приложение",
        click: () => {
          if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: "Перезагрузить приложение",
        click: () => {
          if (mainWindow) {
            mainWindow.reload(); // Перезагружаем окно приложения
          }
        },
      },
      {
        label: "Выйти",
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    // Устанавливаем контекстное меню для трея
    tray.setContextMenu(contextMenu);

    // Обрабатываем клик по иконке в трее
    tray.on("click", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else {
        mainWindow = BrowserWindow.getAllWindows()[0];
        mainWindow.show();
      }
    });
  }

  function startServer() {
    // Указываем путь к server.js
    serverProcess = spawn("node", [path.join(__dirname, "server.js")]);

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

  app.whenReady().then(() => {
    startServer();
    createWindow();
    createTray();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    // Не завершаем приложение, если платформа не macOS
    if (process.platform !== "darwin") {
      // Сворачиваем в трей
      if (tray) {
        tray.displayBalloon({
          title: "Приложение свернуто",
          content: "Приложение продолжает работать в фоновом режиме.",
        });
      }
    }
  });

  app.on("will-quit", () => {
    if (serverProcess) {
      serverProcess.kill();
    }
    if (tray) {
      tray.destroy();
    }
  });
}

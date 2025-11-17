import { spawn } from 'child_process'
import { app, BrowserWindow, Menu, Tray } from 'electron'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let serverProcess
let tray = null

app.commandLine.appendSwitch('enable-accelerated-2d-canvas')
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
	// Если это второй экземпляр, завершаем его
	app.quit()
} else {
	async function createWindow() {
		win = new BrowserWindow({
			icon: path.join(process.env.VITE_PUBLIC, 'icon.svg'),
			webPreferences: {
				preload: path.join(__dirname, 'preload.mjs'),
			},
		})
		win.setMenu(null)

		// Test active push message to Renderer-process.
		win.webContents.on('did-finish-load', () => {
			win?.webContents.send('main-process-message', new Date().toLocaleString())
		})

		if (VITE_DEV_SERVER_URL) {
			win.loadURL(VITE_DEV_SERVER_URL)
		} else {
			// win.loadFile('dist/index.html')
			win.loadFile(path.join(RENDERER_DIST, 'index.html'))
		}
	}

	async function createTray() {
		// Указываем путь к иконке
		const iconPath = path.join(process.env.VITE_PUBLIC, 'icon.png')

		// Создаем трей
		tray = new Tray(iconPath)

		// Создаем контекстное меню для трея
		const contextMenu = Menu.buildFromTemplate([
			{
				label: 'Открыть приложение',
				click: () => {
					if (win) {
						if (win.isMinimized()) {
							win.restore()
						}
						win.show()
						win.focus()
					}
				},
			},
			{
				label: 'Перезагрузить приложение',
				click: () => {
					if (win) {
						win.reload() // Перезагружаем окно приложения
					}
				},
			},
			{
				label: 'Выйти',
				click: () => {
					app.isQuiting = true
					app.quit()
				},
			},
		])

		// Устанавливаем контекстное меню для трея
		tray.setContextMenu(contextMenu)

		// Обрабатываем клик по иконке в трее
		tray.on('click', () => {
			if (BrowserWindow.getAllWindows().length === 0) {
				createWindow()
			} else {
				win = BrowserWindow.getAllWindows()[0]
				win.show()
			}
		})
	}
	async function startServer() {
		// Указываем путь к server.js
		serverProcess = spawn('node', [path.join(process.env.APP_ROOT, 'server.js')])

		serverProcess.stdout.on('data', data => {
			console.log(`Сервер: ${data}`)
		})

		serverProcess.stderr.on('data', data => {
			console.error(`Ошибка сервера: ${data}`)
		})

		serverProcess.on('close', code => {
			console.log(`Сервер завершил работу с кодом ${code}`)
		})
	}
	// Quit when all windows are closed, except on macOS. There, it's common
	// for applications and their menu bar to stay active until the user quits
	// explicitly with Cmd + Q.
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			// Сворачиваем в трей
			if (tray) {
				tray.displayBalloon({
					title: 'Приложение свернуто',
					content: 'Приложение продолжает работать в фоновом режиме.',
				})
			}
		}
	})

	app.on('activate', () => {
		// On OS X it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow()
		}
	})
	app.on('will-quit', () => {
		if (serverProcess) {
			serverProcess.kill()
		}
		if (tray) {
			tray.destroy()
		}
	})

	app.whenReady().then(async () => {
		await startServer()
		await createTray()
		await createWindow()
	})
}

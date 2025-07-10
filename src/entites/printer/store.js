const name = 'printer'

class Printer {
	config = {
		host: '127.0.0.1',
		port: 9100,
		number_labels: 1,
		type_printer: 'tspl',
		printer_resolution: 300,
		VERSION: '',
		CODEPAGE: '',
		DENSITY: '',
		RIBBON: '',
		SHIFT_X: '',
		SHIFT_Y: '',
		SPEED: '',
	}
	loaded = false
	constructor() {
		if (!this.loadConfig()) {
			this.saveConfig()
		}
	}
	loadConfig() {
		if (this.loaded) {
			return true
		}
		try {
			const config = localStorage.getItem(name)
			if (config) {
				this.config = JSON.parse(config)
				this.loaded = true
				return true
			}
		} catch (e) {
			console.log(e)
		}
		return false
	}
	setConfig(config) {
		try {
			this.config = { ...this.config, ...config }
			this.saveConfig()
		} catch (e) {
			console.log(e)
		}
	}
	getConfig() {
		this.loadConfig()
		try {
			return this.config
		} catch (e) {
			console.log(e)
		}
	}
	saveConfig() {
		try {
			localStorage.setItem(name, JSON.stringify(this.config))
			this.loaded = true
		} catch (e) {
			console.log(e)
		}
	}
	get host() {
		return this.getConfig().host
	}
	get port() {
		return Number(this.getConfig().port)
	}
	get number_labels() {
		return Number(this.getConfig().number_labels)
	}
	get type_printer() {
		return this.getConfig().type_printer
	}
	get printer_resolution() {
		return Number(this.getConfig().printer_resolution)
	}
	get VERSION() {
		return this.getConfig().VERSION
	}
	get CODEPAGE() {
		return this.getConfig().CODEPAGE
	}
	get DENSITY() {
		return this.getConfig().DENSITY
	}
	get RIBBON() {
		return this.getConfig().RIBBON
	}
	get SHIFT_X() {
		return this.getConfig().SHIFT_X
	}
	get SHIFT_Y() {
		return this.getConfig().SHIFT_Y
	}
	get SPEED() {
		return this.getConfig().SPEED
	}
}

export const storePrinter = new Printer()

import { makeAutoObservable } from 'mobx'

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
	isLoading = false
	error = ''
	constructor() {
		makeAutoObservable(this)
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
				this.config = { ...this.config, ...JSON.parse(config) }
				this.loaded = true
				return true
			}
		} catch (e) {
			console.log(e)
		}
		return false
	}
	setConfig(config) {
		this.config = { ...this.config, ...config }
		this.saveConfig()
	}
	getConfig() {
		this.loadConfig()
		return this.config
	}
	saveConfig() {
		try {
			localStorage.setItem(name, JSON.stringify(this.config))
			this.loaded = true
		} catch (e) {
			console.log(e)
		}
	}
	setLoading(loading = false) {
		this.isLoading = loading
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
		return parseInt(this.getConfig().printer_resolution, 10)
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

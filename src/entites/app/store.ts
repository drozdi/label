import { makeAutoObservable } from 'mobx'
import { KEY_TIME_AUTO_SAVE, TIME_AUTO_SAVE } from '../../shared/constants'

class StoreApp implements AppContext {
	timeAutoSave = Number(localStorage.getItem(KEY_TIME_AUTO_SAVE) || TIME_AUTO_SAVE)
	showAppLoader = true
	fontFamilyFlag = false
	variableFlag = false
	imageFlag = false
	gridFlag = false
	imageBg = ''
	loadTemplateFlag = false
	settingsFlag = false
	importFlag = false
	dataMatrixFlag = false
	previewFlag = false
	serverError = false
	jsonCodeFlag = false
	errorName = false
	constructor() {
		makeAutoObservable(this)
	}
	async silent(fn: Function) {
		const old = this.showAppLoader
		this.showAppLoader = false
		await fn?.()
		this.showAppLoader = old
	}
	setShowAppLoader(val: boolean) {
		this.showAppLoader = val
	}
	setTimeAutoSave(val: number) {
		localStorage.setItem(KEY_TIME_AUTO_SAVE, val.toString())
		this.timeAutoSave = Number(val)
	}
	setFontFamilyFlag(val: boolean) {
		this.fontFamilyFlag = val
	}
	setVariableFlag(val: boolean) {
		this.variableFlag = val
	}
	setImageFlag(val: boolean) {
		this.imageFlag = val
	}
	setGridFlag(val: boolean) {
		this.gridFlag = val
	}
	setImageBg(bg: string) {
		this.imageBg = bg
	}
	setLoadTemplateFlag(val: boolean) {
		this.loadTemplateFlag = val
	}
	setSettingsFlag(val: boolean) {
		this.settingsFlag = val
	}
	setImportFlag(val: boolean) {
		this.importFlag = val
	}
	setDataMatrixFlag(val: boolean) {
		this.dataMatrixFlag = val
	}
	setPreviewFlag(val: boolean) {
		this.previewFlag = val
	}
	setServerError(val: boolean) {
		this.serverError = val
	}
	setJsonCodeFlag(val: boolean) {
		this.jsonCodeFlag = val
	}
	setErrorName(val: boolean) {
		this.errorName = val
	}
}

export const storeApp = new StoreApp()

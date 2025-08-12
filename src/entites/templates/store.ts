import * as FileSaver from 'file-saver'
import { makeAutoObservable } from 'mobx'
import {
	requestTemplateDelete,
	requestTemplateExportCode,
	requestTemplateId,
	requestTemplateImportCode,
	requestTemplateList,
} from './api'
import { Preview } from './preview'
class StoreTemplates {
	isLoaded = false
	isLoading = false
	_list = []
	error = ''
	selected = null
	get list() {
		this.load()
		return this._list
	}
	constructor() {
		makeAutoObservable(this)
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._list = []
		}
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestTemplateList()
			this._list = res
			this.isLoaded = true
			this.selected = null
		} catch (e) {
			console.error(e)
			this.error = e.message || e.toString() || 'Unknown error'
		} finally {
			this.isLoading = false
		}
	}
	async clear() {
		this.selected = null
	}
	async selectTemplate(id: number | string) {
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestTemplateId(id)
			this.selected = new Preview(res)
		} catch (e) {
			console.error(e)
			this.error = e.message || e.toString() || 'Unknown error'
		} finally {
			this.isLoading = false
		}
	}
	async deleteTemplate(id: number | string) {
		this.isLoading = true
		this.error = ''
		try {
			await requestTemplateDelete(id)
			this.load(true)
		} catch (e) {
			console.error(e)
			this.error = e.message || e.toString() || 'Unknown error'
		} finally {
			this.isLoading = false
		}
	}
	async exportTemplate() {
		if (!this.selected.name || !this.selected.id) {
			return
		}
		const templateName = this.selected.name
		const fileExtension = '.tdmc'
		const data = new Blob([await requestTemplateExportCode(this.selected.id)], {
			type: 'text/plain;charset=utf-8',
		})
		FileSaver.saveAs(data, templateName + fileExtension)
	}
	async importTemplate(file) {
		this.isLoading = true
		this.error = ''
		try {
			const reader = new FileReader()
			reader.onload = async () => {
				const res = await requestTemplateImportCode(reader.result)
				if (res.success !== undefined) {
					await this.selectTemplate(res.data.id)
				}
			}
			reader.readAsText(file)
		} catch (e) {
			this.error = e.message || e.toString() || 'Unknown error'
		} finally {
			this.isLoading = false
		}
	}
}

export const storeTemplates = new StoreTemplates()

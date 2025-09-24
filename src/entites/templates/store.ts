import * as FileSaver from 'file-saver'
import { makeAutoObservable } from 'mobx'
import { Preview } from '../preview/preview'
import {
	requestObjectDelete,
	requestObjectNew,
	requestObjectUpdate,
	requestTemplateDelete,
	requestTemplateExportCode,
	requestTemplateId,
	requestTemplateImportCode,
	requestTemplateList,
	requestTemplateSave,
	requestTemplateUpdate,
} from './api'
class StoreTemplates implements IStoreTemplates {
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
	async load(reloading = false) {
		if (reloading) {
			this.isLoaded = false
			//this._list = []
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
			throw this.error
		} finally {
			this.isLoading = false
		}
	}
	async clear() {
		//this.selected = null
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
			throw this.error
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
			throw this.error
		} finally {
			this.isLoading = false
		}
	}
	async newTemplate(template) {
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestTemplateSave(template)
			this.selectTemplate(res.data.id)
			await this.load(true)
			return res
		} catch (error) {
			console.error(error)
			this.error = error.response?.data?.data || error.message || error.toString() || 'Unknown error'
			throw this.error
		} finally {
			this.isLoading = false
		}
	}
	async updateTemplate(template) {
		this.isLoading = true
		this.error = ''
		try {
			const deleteObjects = this.selected?.objects?.map(item => item.id) ?? []
			const newObjects = []
			const updateObjects = []
			template.objects.forEach(item => {
				let index = -1
				if ((index = deleteObjects.findIndex(id => String(id) === String(item.id))) > -1) {
					deleteObjects.splice(index, 1)
				}
				if (parseInt(item.id) > 0) {
					updateObjects.push({
						...item,
						field_id: item.id,
						id: undefined,
					})
				} else {
					newObjects.push({
						...item,
						id: undefined,
					})
				}
			})
			if (deleteObjects.length > 0) {
				await requestObjectDelete(deleteObjects)
			}
			if (newObjects.length > 0) {
				await requestObjectNew(Number(template.id), newObjects)
			}
			if (updateObjects.length > 0) {
				await requestObjectUpdate(updateObjects)
			}

			const res = await requestTemplateUpdate(template.id, {
				...template,
				objects: undefined,
				id: undefined,
			})
			await this.load(true)
			await this.selectTemplate(template.id)
			return res
		} catch (error) {
			console.error(error)
			this.error = error.response?.data?.data || error.message || error.toString() || 'Unknown error'
			throw this.error
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

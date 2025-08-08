import { makeAutoObservable } from 'mobx'
import { requestIimagesAdd, requestIimagesList } from './api'
class StoreImages {
	isLoading = false
	isLoaded = false
	error = ''
	_list = []
	_default = 0
	constructor() {
		makeAutoObservable(this)
	}
	get list() {
		this.load()
		return this._list
	}
	get defaultImage() {
		return this.list[this._default] || undefined
	}
	async load(reloading = false) {
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
			const res = await requestIimagesList()
			this._list = res.data.response.map(item => ({
				...item,
				data: atob(item.data),
			}))
			this._default = 0
			this.isLoaded = true
		} catch (e) {
			console.error(e)
		} finally {
			this.isLoading = false
		}
	}
	async add(name, file) {
		try {
			const res = await requestIimagesAdd(name, file)
		} catch (e) {
			console.error(e)
		} finally {
			this.load(true)
		}
	}
	default(index) {
		this._default = index
	}
	findById(id) {
		return this._list.find(item => item.id === id)
	}
}

export const storeImages = new StoreImages()

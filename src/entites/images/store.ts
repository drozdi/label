import { makeAutoObservable } from 'mobx'
import { KEY_IMAGE_DEFAULT } from '../../shared/constants'
import {
	requestIimagesList,
	requestImagesAdd,
	requestImagesDelete,
} from './api'

class StoreImages {
	isLoading: boolean = false
	isLoaded: boolean = false
	error: string = ''
	_list: IImage[] = []
	id: number = Number(localStorage.getItem(KEY_IMAGE_DEFAULT) || 1)
	constructor() {
		makeAutoObservable(this)
	}
	get list(): IImage[] {
		this.load()
		return this._list
	}
	get default(): IImage | undefined {
		return this.findById(this.id)
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
			this._list = res.data?.response?.map(item => ({
				...item,
				data: atob(item.data),
			}))
			this.isLoaded = true
		} catch (error) {
			console.error(error)
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add(name: string, data: string) {
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestImagesAdd(name, data)
			//????????????????????????
			this._list.push(res.data)
		} catch (error) {
			console.error(error)
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async remove(id: number) {
		this.isLoading = true
		this.error = ''
		try {
			await requestImagesDelete(id)
			this._list = this._list.filter(item => item.id !== id)
			if (!this.findById(this.id)) {
				this.setId(this._list[0].id)
			}
		} catch (error) {
			console.error(error)
			this.error =
				error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	setId(id: number) {
		this.id = id
		localStorage.setItem(KEY_IMAGE_DEFAULT, String(id))
	}
	findById(id: number) {
		return this._list.find(item => item.id === id)
	}
	findByName(name: string) {
		return this._list.find(item => item.name === name)
	}
	findByTagImages(tagImages: string) {
		return this._list.find(item => item.tag_images === tagImages)
	}
}

export const storeImages = new StoreImages()

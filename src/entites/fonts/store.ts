import { makeAutoObservable } from 'mobx'
import { requestFontsAdd, requestFontsList } from './api'
class StoreFonts {
	isLoading = false
	isLoaded = false
	error = ''
	_list = []
	_default = -1
	constructor() {
		makeAutoObservable(this)
	}
	get list() {
		this.load()
		return this._list
	}
	get defaultFont() {
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
			const res = await requestFontsList()
			this._list = res.data.response
			this.isLoaded = true
			this._list.forEach(async (item, index) => {
				const myFont = new FontFace(
					item.name,
					`url(data:application/octet-stream;base64,${item.data})`
				)
				await myFont.load()
				document.fonts.add(myFont)
			})
		} catch (e) {
			console.error(e)
		} finally {
			this._default = 0
			this.isLoading = false
		}
	}
	async add(name, file) {
		try {
			const res = await requestFontsAdd(name, file)
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
		return this._list.find(item => item.id === id) || this.defaultFont
	}
}

export const storeFonts = new StoreFonts()

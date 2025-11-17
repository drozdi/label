import { makeAutoObservable } from 'mobx'
import { KEY_FONT_DEFAULT } from '../../shared/constants'
import { requestFontsAdd, requestFontsDelete, requestFontsList } from './api'

const map = {
	'ARIALB00.TTF': 'ARIALB00.TTF',
	'ARIALB01.TTF': 'ARIALB01.TTF',
	'ARIALI02.TTF': 'ARIALI02.TTF',
	'ARIALI04.TTF': 'ARIALI04.TTF',
}

class StoreFonts implements IStoreFonts {
	isLoading: boolean = false
	isLoaded: boolean = false
	error: string = ''
	_list: IFont[] = []
	id = Number(localStorage.getItem(KEY_FONT_DEFAULT) || 1)
	constructor() {
		makeAutoObservable(this)
	}
	get list(): IFont[] {
		this.load()
		return this._list
	}
	get default(): IFont | undefined {
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
			const res = await requestFontsList()
			this._list = res.data.response
			this.isLoaded = true
			this._list.forEach(async item => {
				try {
					const myFont = new FontFace(item.name, `url(data:application/octet-stream;base64,${item.data})`)
					await myFont.load()
					document.fonts.add(myFont)
				} catch (e) {}
			})
		} catch (error) {
			console.error(error)
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async add(name: string, data: string) {
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestFontsAdd(name, data)
			const myFont = new FontFace(res.data.name, `url(data:application/octet-stream;base64,${res.data.data})`)
			await myFont.load()
			document.fonts.add(myFont)
			this._list.push(res.data)
		} catch (error) {
			console.error(error)
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}
	async remove(id: number) {
		this.isLoading = true
		this.error = ''
		try {
			await requestFontsDelete(id)
			this._list = this._list.filter(item => item.id !== id)
			if (!this.findById(this.id)) {
				this.setId(this._list[0].id)
			}
		} catch (error) {
			console.error(error)
			this.error = error.response?.data?.detail || error.message || 'Неизвестная ошибка'
		} finally {
			this.isLoading = false
		}
	}

	setId(id: number) {
		this.id = id
		localStorage.setItem(KEY_FONT_DEFAULT, String(id))
	}
	findById(id: number) {
		return this._list.find(item => item.id === id)
	}
	findByName(name: string) {
		return this._list.find(item => item.name === name)
	}
	findByTagFonts(tagFonts: string) {
		return this._list.find(item => item.tag_fonts === tagFonts)
	}
}

export const storeFonts = new StoreFonts()

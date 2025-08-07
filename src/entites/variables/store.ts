import { makeAutoObservable } from 'mobx'
import { requestVariablesList } from './api'
class StoreVariables {
	isLoading = false
	isLoaded = false
	error = ''
	_list = []
	constructor() {
		makeAutoObservable(this)
	}
	get list() {
		this.load()
		return this._list
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
			const res = await requestVariablesList()
			this._list = res
			this.isLoaded = true
		} catch (e) {
			console.error(e)
		} finally {
			this.isLoading = false
		}
	}
}

export const storeVariables = new StoreVariables()

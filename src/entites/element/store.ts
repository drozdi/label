import { makeAutoObservable } from 'mobx'

class StoreElements {
	constructor() {
		makeAutoObservable(this)
	}
}

export const storeElements = new StoreElements()

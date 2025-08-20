import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { debounce } from '../../shared/utils'

class History {
	histories = []
	curIndex = -1
	fn?: Function = undefined
	constructor(fn = () => {}) {
		makeAutoObservable(this)
		this.fn = fn
	}
	get length() {
		return this.histories.length
	}
	get canGoBack() {
		return this.curIndex <= 0
	}
	get canGoForward() {
		return this.curIndex === this.histories.length - 1
	}
	get current() {
		return this.curIndex > -1 ? this.histories[this.curIndex] : undefined
	}
	clear() {
		this.histories = []
		this.curIndex = -1
	}
	fundById(id: number) {
		return this.histories.find(item => item.id === id)
	}
	back() {
		if (this.curIndex > 0) {
			this.curIndex--
			this.fn?.(this.fundById(this.curIndex))
		}
	}
	forward() {
		if (this.curIndex < this.histories.length - 1) {
			this.curIndex++
			this.fn?.(this.fundById(this.curIndex))
		}
	}
	goTo(index: number) {
		if (index >= 0 && index < this.histories.length) {
			this.curIndex = index
			this.fn?.(this.fundById(this.curIndex))
		}
	}
	append(objects: any[], label = '', props: Record<string, any> = {}) {
		const t = dayjs().format('HH:mm:ss')
		const tmp = JSON.stringify(this.fundById(this.curIndex)?.objects || [])
		const last = JSON.stringify(this.histories[0]?.objects || [])
		const items = JSON.stringify(objects)
		if (tmp !== items && last !== items) {
			this.curIndex = this.histories.length
			this.histories.unshift({
				objects: JSON.parse(items),
				label,
				time: t,
				props,
				id: this.histories.length,
			})
		} else if (last === items) {
			this.goTo(this.histories.length - 1)
		}
	}
}
export const storeHistory = new History()

export const histroyAppendDebounce = debounce((...args: any[]) => {
	storeHistory.append(...args)
}, 500)

export const histroyAppend = (...args: any[]) => {
	storeHistory.append(...args)
}

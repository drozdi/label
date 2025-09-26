import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'

let id = 1

class StoreHistory implements IStoreHistory {
	histories = []
	curr = -1
	fn?: Function = undefined
	constructor(fn = () => {}) {
		makeAutoObservable(this)
		this.fn = fn
	}
	get length() {
		return this.histories.length
	}
	get current() {
		return this.findById(this.curr)
	}
	get isFirst() {
		return this.curr === this.histories[0]?.id
	}
	get isLast() {
		return this.curr === this.histories[this.histories.length - 1]?.id
	}
	get canGoBack() {
		return this.histories.length > 0 && !this.isFirst
	}
	get canGoForward() {
		return this.histories.length > 0 && !this.isLast
	}
	clear() {
		while (this.histories.length) {
			this.histories.pop()
		}
		this.histories = []
		this.curr = -1
	}
	findById(id: number) {
		return this.histories.find(item => item.id === id)
	}
	isCurrent(id: number) {
		return id === this.curr
	}
	back() {
		if (this.canGoBack) {
			const index = this.histories.findIndex(item => item.id === this.curr)
			this.curr = this.histories[index - 1]?.id || -1
			this.fn?.(this.findById(this.curr))
		}
	}
	forward() {
		if (this.canGoForward) {
			const index = this.histories.findIndex(item => item.id === this.curr)
			this.curr = this.histories[index + 1]?.id || -1
			this.fn?.(this.findById(this.curr))
		}
	}
	goTo(index: number) {
		console.log(index)
		this.curr = index
		this.fn?.(this.findById(this.curr))
	}
	append(objects: any[], label = '', props: Record<string, any> = {}) {
		const tmp = JSON.stringify(this.findById(this.curr)?.objects || [])
		const last = JSON.stringify(this.histories[0]?.objects || [])
		const items = JSON.stringify(objects)
		if (tmp !== items && last !== items) {
			this.curr = id++
			this.histories.unshift({
				objects: JSON.parse(items),
				label,
				time: dayjs().format('HH:mm:ss'),
				props,
				id: this.curr,
			})
		} else if (last === items) {
			this.goTo(this.histories[0]?.id || -1)
		}
	}
}
export const storeHistory = new StoreHistory()

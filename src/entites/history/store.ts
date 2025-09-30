import dayjs from 'dayjs'
import { makeAutoObservable } from 'mobx'
import { genId } from '../../shared/utils'
let id = 1

class StoreHistory implements IStoreHistory {
	histories = []
	curr = ''
	fn?: Function = undefined
	constructor(fn = () => {}) {
		makeAutoObservable(this)
		this.fn = fn
	}
	get length() {
		return this.histories.length || 0
	}
	get currIndex() {
		return this.histories.findIndex(item => item.id === this.curr)
	}
	get current(): IHistory | undefined {
		return this.findById(this.curr)
	}
	get isFirst(): boolean {
		return this.curr === this.histories[0]?.id
	}
	get isLast(): boolean {
		return this.curr === this.histories[this.histories.length - 1]?.id
	}
	get canGoBack(): boolean {
		return this.currIndex !== -1 && this.currIndex < this.histories.length - 1
	}
	get canGoForward(): boolean {
		return this.currIndex > 0
	}
	clear() {
		while (this.length) {
			this.histories.pop()
		}
		this.histories = []
		this.curr = ''
	}
	findById(id: string) {
		return this.histories.find(item => item.id === id)
	}
	isCurrent(id: number) {
		return id === this.curr
	}
	back() {
		if (this.canGoBack) {
			this.curr = this.histories[this.currIndex + 1]?.id || -1
			this.fn?.(this.findById(this.curr))
		}
	}
	forward() {
		if (this.canGoForward) {
			this.curr = this.histories[this.currIndex - 1]?.id || -1
			this.fn?.(this.findById(this.curr))
		}
	}
	goTo(index: string) {
		this.curr = index
		this.fn?.(this.findById(this.curr))
	}
	append(objects: any[], label = '', props: Record<string, any> = {}) {
		const tmp = JSON.stringify(this.findById(this.curr)?.objects || [])
		const last = JSON.stringify(this.histories[0]?.objects || [])
		const items = JSON.stringify(objects)
		if (tmp !== items && last !== items) {
			this.curr = genId()
			this.histories.unshift({
				objects: JSON.parse(items),
				label,
				time: dayjs().format('HH:mm:ss'),
				props,
				id: this.curr,
			})
		} else if (last === items) {
			this.goTo(this.histories[0]?.id || '')
		}
	}
}
export const storeHistory = new StoreHistory()

import { makeAutoObservable } from 'mobx'

class StoreGuideLine {
	gap = 5
	width: number = 0
	height: number = 0
	num: number = 5

	constructor() {
		makeAutoObservable(this)
	}
	get divisionsX() {
		const step = (this.width - this.gap * 2) / (this.num + 1)
		return new Array(this.num + 2).fill(0).map((item, index) => {
			return this.gap + step * index
		})
	}
	get divisionsY() {
		const step = (this.height - this.gap * 2) / (this.num + 1)
		return new Array(this.num + 2).fill(0).map((item, index) => {
			return this.gap + step * index
		})
	}

	setGap(gap: number) {
		this.gap = gap
	}
	setWidth(width: number) {
		this.width = width
	}
	setHeight(height: number) {
		this.height = height
	}
	setNum(num: number) {
		this.num = num
	}
}

export const storeGuideLine = new StoreGuideLine()

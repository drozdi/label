import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { debounce, round } from '../../shared/utils'

const histroyAppendDebounce = debounce((...args: any[]) => {
	storeHistory.append(...args)
}, 500)

const histroyAppend = (...args: any[]) => {
	storeHistory.append(...args)
}

export const serviceTemplate = {
	_moveX(value: number) {
		storeTemplate.selectedIndex.forEach(index => {
			if (index > -1) {
				storeTemplate.objects[index].setPosX(
					round(storeTemplate.objects[index].pos_x + value)
				)
				storeTemplate.objects[index] = storeTemplate.objects[index].copy()
			}
		})
	},
	_moveY(value: number) {
		storeTemplate.selectedIndex.forEach(index => {
			if (index > -1) {
				storeTemplate.objects[index].setPosY(
					round(storeTemplate.objects[index].pos_y + value)
				)
				storeTemplate.objects[index] = storeTemplate.objects[index].copy()
			}
		})
	},
	move(dx: number, dy: number) {
		this._moveX(dx)
		this._moveY(dy)
		if (dx !== 0 || dy !== 0) {
			histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
		}
	},
	moveX(value: number) {
		if (value === 0) {
			return
		}
		this._moveX(value)
		histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
	},
	moveY(value: number) {
		if (value === 0) {
			return
		}
		this._moveY(value)
		histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
	},
	deleteObject() {
		;[...storeTemplate.selected].forEach(id => {
			const object = storeTemplate.findById(id)
			storeTemplate.deleteObject(id)
			histroyAppend(storeTemplate.objects, `Удаление "${object.name}"`, {
				title: `Тип: ${object.type} ${object.code_type}`,
			})
		})
	},
	setName(v) {
		const name = storeTemplate.current?.name
		storeTemplate.current?.setName(v)
		histroyAppend(storeTemplate.objects, `Переименование "${name}" в "${v}"`)
	},
}

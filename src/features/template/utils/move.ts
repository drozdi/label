import { histroyAppendDebounce } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'

export const move = (dx: number, dy: number) => {
	storeTemplate.moveX(dx)
	storeTemplate.moveY(dy)
	if (dx !== 0 || dy !== 0) {
		histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
	}
}
export const moveX = (dx: number) => {
	storeTemplate.moveX(dx)
	histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
}
export const moveY = (dy: number) => {
	storeTemplate.moveY(dy)
	histroyAppendDebounce(storeTemplate.objects, `Смещение элементов`)
}

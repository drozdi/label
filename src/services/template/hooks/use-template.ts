import { storeTemplate } from '../../../entites/template/store'
import { useHistory } from '../../../services/history/hooks/use-history'
import { round } from '../../../shared/utils'

const history = useHistory()

export function useTemplate() {
	return {
		move: (dx: number, dy: number) => {
			storeTemplate.moveX(dx)
			storeTemplate.moveY(dy)
			if (dx !== 0 || dy !== 0) {
				history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
			}
		},
		moveX: (dx: number) => {
			storeTemplate.moveX(dx)
			history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
		},
		moveY: (dy: number) => {
			storeTemplate.moveY(dy)
			history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
		},
		deleteObject: () => {
			;[...storeTemplate.selected].forEach(id => {
				const object = storeTemplate.findById(id)
				storeTemplate.deleteObject(id)
				history.append(storeTemplate.objects, `Удаление "${object.name}"`, {
					title: `Тип: ${object.type} ${object.code_type}`,
				})
			})
		},
		resizeObject: (dw: number, dh: number) => {
			storeTemplate.setWidth(round(storeTemplate.current.width + dw))
			storeTemplate.setHeight(round(storeTemplate.current.height + dh))

			history.appendDebounce(
				storeTemplate.objects,
				`Изменение размера "${storeTemplate.current?.name}" - ${storeTemplate.current?.width} x ${storeTemplate.current?.height}`
			)
		},
	}
}

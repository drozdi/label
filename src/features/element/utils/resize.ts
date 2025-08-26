import { histroyAppendDebounce } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'
import { round } from '../../../shared/utils'

export const resizeObject = (dw: number, dh: number) => {
	storeTemplate.setWidth(round(storeTemplate.current.width + dw))
	storeTemplate.setHeight(round(storeTemplate.current.height + dh))
	histroyAppendDebounce(
		storeTemplate.objects,
		`Изменение размера "${storeTemplate.current?.name}" - ${storeTemplate.current?.width} x ${storeTemplate.current?.height}`
	)
}

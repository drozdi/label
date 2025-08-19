import { histroyAppendDebounce } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'
import { minMax } from '../../../shared/utils'

export const resizeObject = (dw: number, dh: number) => {
	storeTemplate.setWidth(minMax(storeTemplate.current.width + dw, 0.1))
	storeTemplate.setHeight(minMax(storeTemplate.current.height + dh, 0.1))
	histroyAppendDebounce(
		storeTemplate.objects,
		`Изменение размера "${storeTemplate.current?.name}" - ${storeTemplate.current?.width} x ${storeTemplate.current?.height}`
	)
}

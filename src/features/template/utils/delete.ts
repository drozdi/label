import { histroyAppend } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'

export const deleteObject = () => {
	;[...storeTemplate.selected].forEach(id => {
		const object = storeTemplate.findById(id)
		storeTemplate.deleteObject(id)
		histroyAppend(storeTemplate.objects, `Удаление "${object.name}"`, {
			title: `Тип: ${object.type} ${object.code_type}`,
		})
	})
}

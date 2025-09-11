import { observer } from 'mobx-react-lite'
import { factoryElement } from '../../entites/element'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { genId } from '../../shared/utils'

export const ItemElement = observer(
	({
		label,
		callback,
		element,
	}: {
		label: string
		callback: () => void
		element: Record<string, any>
	}) => {
		const handleSelect = () => {
			const id = genId()
			const object = factoryElement({
				id,
				name: label,
				...element,
			})
			storeTemplate.addObject(object)
			storeTemplate.setActiveObject(id)
			histroyAppend(storeTemplate.objects, `Добавление "${object.name}"`, {
				title: `Тип: ${object.type} ${object.code_type}`,
			})
			callback?.()
		}
		return <Item onClick={handleSelect}>{label}</Item>
	}
)

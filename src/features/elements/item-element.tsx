import { observer } from 'mobx-react-lite'
import { factoryElement } from '../../entites/element'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { genId } from '../../shared/utils'
import { useAppContext } from '../context'

export const ItemElement = observer(({ label, callback, element }) => {
	const ctx = useAppContext()
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
		callback?.(ctx)
	}
	return <Item onClick={handleSelect}>{label}</Item>
})

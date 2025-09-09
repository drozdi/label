import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { factoryElement } from '../../entites/element'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { genId } from '../../shared/utils'

export const ItemElement = observer(({ label, callback, element }) => {
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
		callback?.(storeApp)
	}
	return <Item onClick={handleSelect}>{label}</Item>
})

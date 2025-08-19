import { observer } from 'mobx-react-lite'
import { factoryElement } from '../../entites/element'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { genId } from '../../shared/utils'
import { useAppContext } from '../context'
import classes from './Item.module.css'

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
	return (
		<div className={classes.root} onClick={handleSelect}>
			{label}
		</div>
	)
})

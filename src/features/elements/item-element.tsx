import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import classes from './Item.module.css'

const genId = () => {
	return 'n' + Math.random().toString(36).substring(2, 15)
}

export const ItemElement = observer(({ label, callback, element }) => {
	const ctx = useAppContext()
	const handleSelect = () => {
		const id = genId()
		storeTemplate.addObject({
			id,
			name: label,
			...element,
		})
		storeTemplate.setActiveObject(id)
		callback?.(ctx)
	}
	return (
		<div className={classes.root} onClick={handleSelect}>
			{label}
		</div>
	)
})

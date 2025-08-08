import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import classes from './Item.module.css'

export const ItemVariable = observer(({ variable }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const handleSelect = () => {
		storeTemplate.setData((current.data + ' ' + variable.data).trim())
		ctx.setVariableFlag(false)
	}
	return (
		<div className={classes.root} onClick={handleSelect}>
			{variable.name}
			<br /> {variable.data}
		</div>
	)
})

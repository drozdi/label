import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { useAppContext } from '../context'

export const ItemVariable = observer(({ variable }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const handleSelect = () => {
		storeTemplate.setData((current.data + ' ' + variable.data).trim())
		ctx?.setVariableFlag(false)
	}
	return (
		<Item onClick={handleSelect}>
			{variable.name}
			<br /> {variable.data}
		</Item>
	)
})

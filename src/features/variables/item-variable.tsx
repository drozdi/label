import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'

export const ItemVariable = observer(({ variable }) => {
	const { current } = storeTemplate
	const handleSelect = () => {
		storeTemplate.setData((current.data + ' ' + variable.data).trim())
		storeApp?.setVariableFlag(false)
	}
	return (
		<Item onClick={handleSelect}>
			{variable.name}
			<br /> {variable.data}
		</Item>
	)
})

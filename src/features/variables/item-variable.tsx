import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'

export const ItemVariable = observer(
	({ variable }: { variable: { name: string; data: string } }) => {
		const handleSelect = () => {
			storeTemplate.setData(variable.data)
			storeApp?.setVariableFlag(false)
		}
		return (
			<Item onClick={handleSelect}>
				{variable.name}
				<br /> {variable.data}
			</Item>
		)
	}
)

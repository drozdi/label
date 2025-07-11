import { List } from '../../shared/ui'
import Memory from '../../store/Memory'
import { ItemVarText } from './ItemVarText'

export const ListVatText = ({ selectVar }) => {
	return (
		<List
			style={{
				gap: 8,
			}}
		>
			{Memory.var_date.map(variable => (
				<ItemVarText
					selectVar={selectVar}
					variable={variable}
					key={variable.data}
				/>
			))}
		</List>
	)
}

import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeVariables } from '../../entites/variables/store'
import { ItemVariable } from './item-variable'

export const ListVariable = observer(() => {
	const { list } = storeVariables
	console.log(list)
	return (
		<Stack>
			{list.map(variable => (
				<ItemVariable key={variable.data} variable={variable} />
			))}
		</Stack>
	)
})

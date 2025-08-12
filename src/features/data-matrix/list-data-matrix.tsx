import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { ItemDataMatrix } from './item-data-matrix'

export const ListDataMatrix = observer(() => {
	const { list } = storeDataMatrix
	return (
		<Stack>
			{list.map(dataMatrix => (
				<ItemDataMatrix key={dataMatrix.id} dataMatrix={dataMatrix} />
			))}
		</Stack>
	)
})

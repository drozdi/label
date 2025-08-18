import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplates } from '../../entites/templates/store'
import { ItemTemplate } from './item-template'

export const ListTemplate = observer(() => {
	const { isLoading, list, error, selected } = storeTemplates

	return (
		<Stack gap={2}>
			{list.map(item => (
				<ItemTemplate key={item.id} template={item} />
			))}
		</Stack>
	)
})

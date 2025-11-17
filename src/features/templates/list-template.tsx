import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { storeTemplates } from '../../entites/templates/store'
import { ItemTemplate } from './item-template'

export const ListTemplate = observer(({ query = '' }: { query: string }) => {
	const { isLoading, list, error, selected } = storeTemplates
	const filtered = useMemo<
		{
			name: string
			[key: string]: any
		}[]
	>(() => (query ? (list || []).filter(temp => temp.name.includes(query)) : list), [list, query])

	return (
		<Stack gap={2}>
			{filtered.map(item => (
				<ItemTemplate key={item.id} template={item} />
			))}
		</Stack>
	)
})

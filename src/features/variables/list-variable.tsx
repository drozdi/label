import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { storeVariables } from '../../entites/variables/store'
import { ItemVariable } from './item-variable'

export const ListVariable = observer(({ query = '' }) => {
	const { list } = storeVariables
	const filtered = useMemo(
		() =>
			query
				? (list || []).filter(
						variable =>
							variable.data.includes(query) || variable.name.includes(query)
					)
				: list,
		[list, query]
	)
	return (
		<Stack>
			{filtered.map(variable => (
				<ItemVariable key={variable.data} variable={variable} />
			))}
		</Stack>
	)
})

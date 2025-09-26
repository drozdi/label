import { Drawer, ScrollArea, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { ListVariable } from './list-variable'

export const DrawerVariable = observer(() => {
	const [search, setSearch] = useState('')
	const [query] = useDebouncedValue(search, 300)
	return (
		<Drawer
			title='Переменные'
			scrollAreaComponent={ScrollArea}
			opened={storeApp.variableFlag}
			onClose={() => {
				storeApp?.setVariableFlag(false)
			}}
		>
			<TextInput value={search} onChange={({ target }) => setSearch(target.value)} required />
			<ListVariable query={query} />
		</Drawer>
	)
})

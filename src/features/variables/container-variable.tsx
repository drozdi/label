import { CloseButton, Group, ScrollArea, Stack, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useAppContext } from '../context'
import { ListVariable } from './list-variable'

export const ContainerVariable = observer(() => {
	const ctx = useAppContext()
	const handleClose = () => {
		ctx?.setVariableFlag(false)
	}
	const [search, setSearch] = useState('')
	const [query] = useDebouncedValue(search, 300)
	return (
		<Stack h='100%'>
			<Group mt='xs' justify='space-between'>
				Переменные
				<CloseButton onClick={handleClose} />
			</Group>
			<TextInput
				value={search}
				onChange={({ target }) => setSearch(target.value)}
				required
			/>
			<ScrollArea h='100%'>
				<ListVariable query={query} />
			</ScrollArea>
		</Stack>
	)
})

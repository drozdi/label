import { ScrollArea, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Container } from '../../shared/ui'
import { ListTemplate } from './list-template'

export const ContainerTemplate = observer(props => {
	const [search, setSearch] = useState('')
	const [query] = useDebouncedValue(search, 300)
	return (
		<Container as={ScrollArea} p='xs' h='100%' label='Шаблоны' {...props}>
			<TextInput value={search} onChange={({ target }) => setSearch(target.value)} required />
			<ListTemplate query={query} />
		</Container>
	)
})

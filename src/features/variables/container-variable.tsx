import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { Container } from '../../shared/ui'
import { ListVariable } from './list-variable'

export const ContainerVariable = observer(() => {
	const handleClose = () => {
		storeApp?.setVariableFlag(false)
	}
	const [search, setSearch] = useState('')
	const [query] = useDebouncedValue(search, 300)
	return (
		<Container label='Переменные' onClose={handleClose}>
			<TextInput value={search} onChange={({ target }) => setSearch(target.value)} required />
			<ListVariable query={query} />
		</Container>
	)
})

import { ScrollArea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { Container } from '../../shared/ui'
import { ListDataMatrix } from './list-data-matrix'

export const ContainerDataMatrix = observer(props => {
	return (
		<Container as={ScrollArea} p='xs' h='100%' label='Выбирите ДМ' {...props}>
			<ListDataMatrix />
		</Container>
	)
})

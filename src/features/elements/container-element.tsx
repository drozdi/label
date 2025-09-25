import { ScrollArea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { Container } from '../../shared/ui'
import { ListElement } from './list-element'

export const ContainerElement = observer(props => {
	return (
		<Container as={ScrollArea} p='xs' h='100%' label='Добавить элемент' {...props}>
			<ListElement />
		</Container>
	)
})

import { ScrollArea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useBreakpoint } from '../../shared/hooks'
import { Container } from '../../shared/ui'
import { ListElement } from './list-element'

export const ContainerElement = observer(props => {
	const isMobile = useBreakpoint('xs')
	return (
		<Container as={ScrollArea} p='xs' h='100%' label={isMobile ? '' : 'Добавить элемент'} {...props}>
			<ListElement />
		</Container>
	)
})

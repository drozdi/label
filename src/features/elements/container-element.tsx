import { ScrollArea, Stack, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { ListElement } from './list-element'

export const ContainerElement = observer(() => {
	return (
		<Stack h='100%'>
			<Title mt='xs' order={5}>
				Добавить элемент
			</Title>
			<ScrollArea h='100%'>
				<ListElement />
			</ScrollArea>
		</Stack>
	)
})

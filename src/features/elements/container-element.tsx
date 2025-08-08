import { Stack, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { ListElement } from './list-element'

export const ContainerElement = observer(() => {
	return (
		<Stack gap='sm'>
			<Title order={5}>Добавить элемент</Title>
			<ListElement />
		</Stack>
	)
})

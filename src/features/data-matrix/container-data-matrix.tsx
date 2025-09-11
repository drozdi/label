import { Group, ScrollArea, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { ListDataMatrix } from './list-data-matrix'

export const ContainerDataMatrix = observer(() => {
	const handleClose = () => {
		storeApp.setDataMatrixFlag(false)
	}
	return (
		<Stack h='100%'>
			<Group mt='xs' justify='space-between'>
				Выбирите ДМ
				{/* <CloseButton onClick={handleClose} /> */}
			</Group>
			<ScrollArea h='100%'>
				<ListDataMatrix />
			</ScrollArea>
		</Stack>
	)
})

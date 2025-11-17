import { Drawer, ScrollArea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { ListElement } from './list-element'

export const ContainerElement = observer(props => {
	return (
		<Drawer
			scrollAreaComponent={ScrollArea}
			opened={storeApp.elementFlag}
			onClose={() => storeApp.setElementFlag(false)}
			title='Добавить элемент'
			position='left'
			{...props}
		>
			<ListElement />
		</Drawer>
	)
})

import { Drawer, ScrollArea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { ListDataMatrix } from './list-data-matrix'

export const DrawerDataMatrix = observer(() => {
	return (
		<Drawer
			scrollAreaComponent={ScrollArea}
			title='Выбирите ДМ'
			opened={storeApp?.dataMatrixFlag}
			onClose={() => storeApp?.setDataMatrixFlag(false)}
		>
			<ListDataMatrix />
		</Drawer>
	)
})

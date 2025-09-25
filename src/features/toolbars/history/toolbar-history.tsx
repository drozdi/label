import { ActionIcon } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbArrowBack, TbArrowForward } from 'react-icons/tb'
import { storeHistory } from '../../../entites/history/store'
import { Toolbar } from '../../../shared/ui'

export const ToolbarHistory = observer(props => {
	return (
		<Toolbar {...props}>
			<ActionIcon title='Назад' disabled={storeHistory.canGoBack} onClick={() => storeHistory.back()}>
				<TbArrowBack />
			</ActionIcon>
			<ActionIcon title='Вперед' disabled={storeHistory.canGoForward} onClick={() => storeHistory.forward()}>
				<TbArrowForward />
			</ActionIcon>
		</Toolbar>
	)
})

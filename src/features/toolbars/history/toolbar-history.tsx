import { ActionIcon } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbArrowBack, TbArrowForward } from 'react-icons/tb'
import { storeApp } from '../../../entites/app/store'
import { storeHistory } from '../../../entites/history/store'
import { Toolbar } from '../../../shared/ui'

export const ToolbarHistory = observer(({ disabled, ...props }: { disabled?: boolean; [key: string]: any }) => {
	return (
		storeApp.historyCount > 0 && (
			<Toolbar {...props}>
				<ActionIcon title='Назад' disabled={!storeHistory.canGoBack} onClick={() => storeHistory.back()}>
					<TbArrowBack />
				</ActionIcon>
				<ActionIcon title='Вперед' disabled={!storeHistory.canGoForward} onClick={() => storeHistory.forward()}>
					<TbArrowForward />
				</ActionIcon>
			</Toolbar>
		)
	)
})

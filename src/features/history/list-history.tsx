import { ScrollArea, Stack, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import classes from './item.module.css'

export const ListHistory = observer(() => {
	return (
		<ScrollArea h='100%'>
			{storeHistory.length > 0 ? (
				<Stack gap='4'>
					{storeHistory.histories.map(({ time, label, props, objects, id }) => (
						<Text
							key={id}
							className={
								classes.item +
								(id === storeHistory.curIndex ? ' ' + classes.active : '')
							}
							{...props}
							size='sm'
							onClick={() => {
								storeTemplate.loadObjects(JSON.parse(JSON.stringify(objects)))
								storeHistory.curIndex = id
							}}
						>
							{time}: {label}
						</Text>
					))}
				</Stack>
			) : (
				<Text c='dimmed' size='xl'>
					Нет ни каких изменений
				</Text>
			)}
		</ScrollArea>
	)
})

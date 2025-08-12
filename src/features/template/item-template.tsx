import { Text, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplates } from '../../entites/templates/store'
import classes from './Item.module.css'

export const ItemTemplate = observer(({ template }) => {
	const { isLoading } = storeTemplates
	return (
		<div
			className={
				classes.root +
				(storeTemplates.selected?.id === template.id
					? ' ' + classes.selected
					: '') +
				(isLoading ? ' ' + classes.disabled : '')
			}
			onClick={() => !isLoading && storeTemplates.selectTemplate(template.id)}
		>
			<Title order={6}>{template.name}</Title>
			<Text c='dimmed' size='xs'>
				{template.width_mm} * {template.height_mm}
			</Text>
		</div>
	)
})

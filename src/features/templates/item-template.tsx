import { Text, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeTemplates } from '../../entites/templates/store'

import { Item } from '../../shared/ui'

export const ItemTemplate = observer(({ template }) => {
	const { isLoading } = storeTemplates
	return (
		<Item
			active={storeTemplates.selected?.id === template.id}
			disabled={isLoading}
			onClick={() => {
				!isLoading && storeTemplates.selectTemplate(template.id)
				storeApp.setLeftMenuFlag(false)
			}}
		>
			<Title order={6}>{template.name}</Title>
			<Text c='dimmed' size='xs'>
				{template.width_mm} * {template.height_mm}
			</Text>
		</Item>
	)
})

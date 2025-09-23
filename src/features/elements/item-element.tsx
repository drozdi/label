import { Box } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { factoryElement } from '../../entites/element'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { genId } from '../../shared/utils'

export const ItemElement = observer(
	({
		label,
		icon,
		callback,
		element,
		component = 'div',
	}: {
		label: string
		icon: React.ReactNode
		callback: () => void
		element: Record<string, any>
		component: React.ReactNode
	}) => {
		const handleSelect = () => {
			const id = genId()
			const object = factoryElement({
				id,
				name: label,
				...element,
			})
			storeTemplate.addObject(object)
			storeTemplate.setActiveObject(id)
			histroyAppend(storeTemplate.objects, `Добавление "${object.name}"`, {
				title: `Тип: ${object.type} ${object.code_type}`,
			})
			callback?.()
		}
		return (
			<Item onClick={handleSelect}>
				<Box component={component} align='stretch' justify='center' ta='center' lh='1'>
					<Box fz='3rem'>{icon}</Box>
					{label}
				</Box>
			</Item>
		)
	}
)

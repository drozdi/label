import { Box, Tooltip } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { factoryElement } from '../../entites/element'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { WIDTH_MOBILE } from '../../shared/constants'
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
		const history = useHistory()
		const isMobile = useViewportSize().width < WIDTH_MOBILE
		const handleSelect = () => {
			const id = genId()
			const object = factoryElement({
				id,
				name: label,
				...element,
			})
			storeTemplate.addObject(object)
			storeTemplate.setActiveObject(id)
			history.append(storeTemplate.objects, `Добавление "${object.name}"`, {
				title: `Тип: ${object.type} ${object.code_type}`,
			})
			callback?.()
		}
		return (
			<Item onClick={handleSelect}>
				<Tooltip label={label}>
					<Box component={component} align='stretch' justify='center' ta='center' lh='1'>
						<Box fz='3rem'>{icon}</Box>
						{!isMobile && label}
					</Box>
				</Tooltip>
			</Item>
		)
	}
)

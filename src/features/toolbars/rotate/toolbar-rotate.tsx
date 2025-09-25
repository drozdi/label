import { ActionIcon } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbRotate2, TbRotateClockwise2 } from 'react-icons/tb'
import { storeHistory } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'
import { Toolbar } from '../../../shared/ui'
import { round } from '../../../shared/utils'

export const ToolbarRotate = observer(props => {
	const handleRotateRight = () => {
		const { width_mm, height_mm, width, height } = storeTemplate
		storeTemplate.changeWidth(height_mm)
		storeTemplate.changeHeight(width_mm)
		storeTemplate.loadObjects(
			storeTemplate.objects.map(item => {
				let newItem = {
					...(item.getCorrectProps?.() || item),
				}
				if (item.properties.includes('rotation')) {
					const rotation = (newItem.rotation + 90) % 360
					newItem = {
						...newItem,
						pos_x: round(height_mm - newItem.pos_y),
						pos_y: round(newItem.pos_x),
						rotation: rotation,
					}
				} else if ('lines' === item.type) {
					let { width, height, pos_x, pos_y, line_thickness } = newItem

					width -= pos_x
					pos_y = height
					height = line_thickness

					newItem = {
						...newItem,
						pos_y: round(pos_x),
						pos_x: round(height_mm - pos_y - height),
						width: round(height_mm - pos_y),
						height: round(pos_x),
						line_thickness: round(width),
					}
				} else {
					newItem = {
						...newItem,
						pos_y: round(newItem.pos_x),
						pos_x: round(height_mm - newItem.height - newItem.pos_y),
						width: round(newItem.height),
						height: round(newItem.width),
					}
				}

				return newItem
			})
		)
		storeHistory.append(storeTemplate.objects, 'Поворот на -90')
	}
	const handleRotateLeft = () => {
		const { width_mm, height_mm } = storeTemplate
		storeTemplate.changeWidth(height_mm)
		storeTemplate.changeHeight(width_mm)
		storeTemplate.loadObjects(
			storeTemplate.objects.map(item => {
				let newItem = {
					...(item.getCorrectProps?.() || item),
				}
				if (item.properties.includes('rotation')) {
					const rotation = (newItem.rotation + 270) % 360
					newItem = {
						...newItem,
						pos_x: round(newItem.pos_y),
						pos_y: round(width_mm - newItem.pos_x),
						rotation: rotation,
					}
				} else if ('lines' === item.type) {
					let { width, height, pos_x, pos_y, line_thickness } = newItem

					width -= pos_x
					pos_y = height
					height = line_thickness

					newItem = {
						...newItem,
						pos_x: round(pos_y),
						pos_y: round(width_mm - pos_x - width),
						width: round(height + pos_y),
						height: round(width_mm - pos_x - width),
						line_thickness: round(width),
					}
				} else {
					newItem = {
						...newItem,
						pos_x: round(newItem.pos_y),
						pos_y: round(width_mm - newItem.pos_x - newItem.width),
						width: round(newItem.height),
						height: round(newItem.width),
					}
				}

				return newItem
			})
		)
		storeHistory.append(storeTemplate.objects, 'Поворот на 90')
	}
	return (
		<Toolbar {...props}>
			<ActionIcon variant='filled' onClick={handleRotateLeft}>
				<TbRotate2 />
			</ActionIcon>
			<ActionIcon variant='filled' onClick={handleRotateRight}>
				<TbRotateClockwise2 />
			</ActionIcon>
		</Toolbar>
	)
})

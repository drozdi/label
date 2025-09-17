import { Button, Group, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbRotate2 } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceTemplate } from '../../services/template/service'

export const HeaderMain = observer(() => {
	const { importFlag, previewFlag, errorName } = storeApp
	const handleRotateRight = () => {
		const { width_mm, height_mm, width, height } = storeTemplate
		storeTemplate.changeWidth(height_mm)
		storeTemplate.changeHeight(width_mm)
		storeTemplate.loadObjects(
			storeTemplate.objects.map(item => {
				// let newItem = {
				// 	...item.getCorrectProps(),
				// 	pos_x: height_mm - item.height - item.pos_y,
				// 	pos_y: item.pos_x,
				// 	rotation: (item.rotation + 90) % 360,
				// }

				let newItem = {
					...(item.getCorrectProps?.() || item),
				}
				// console.log({ ...newItem })
				// console.log(rect)
				if (item.properties.includes('rotation')) {
					newItem = {
						...newItem,
						pos_y: newItem.pos_x,
						pos_x: height_mm - newItem.height - newItem.pos_x,
						rotation: (newItem.rotation + 270) % 360,
					}
				} else if ('lines' === item.type) {
					let { width, height, pos_x, pos_y, line_thickness } = newItem

					width -= pos_x
					pos_y = height
					height = line_thickness

					newItem = {
						...newItem,
						pos_x: pos_y,
						pos_y: width_mm - pos_x - width,
						width: height + pos_y,
						height: width_mm - pos_x - width,
						line_thickness: width,
					}
				} else {
					newItem = {
						...newItem,
						pos_y: newItem.pos_x,
						pos_x: height_mm - newItem.height - newItem.pos_y,
						width: newItem.height,
						height: newItem.width,
					}
				}

				return newItem
			})
		)
		//storeTemplate.loadObjects(storeTemplate.objects)
		storeHistory.append(storeTemplate.objects, 'Поворот на -90')
	}
	const handleRotateLeft = () => {
		const { width_mm, height_mm } = storeTemplate
		storeTemplate.changeWidth(height_mm)
		storeTemplate.changeHeight(width_mm)
		storeTemplate.loadObjects(
			storeTemplate.objects.map(item => {
				const rect = item.size(storeTemplate.scale)
				let newItem = {
					...(item.getCorrectProps?.() || item),
				}
				// console.log({ ...newItem })
				// console.log(rect)
				if (item.properties.includes('rotation')) {
					newItem = {
						...newItem,
						pos_x: newItem.pos_y,
						pos_y: width_mm - newItem.pos_x,
						rotation: (newItem.rotation + 270) % 360,
					}
				} else if ('lines' === item.type) {
					let { width, height, pos_x, pos_y, line_thickness } = newItem

					width -= pos_x
					pos_y = height
					height = line_thickness

					newItem = {
						...newItem,
						pos_x: pos_y,
						pos_y: width_mm - pos_x - width,
						width: height + pos_y,
						height: width_mm - pos_x - width,
						line_thickness: width,
					}
				} else {
					newItem = {
						...newItem,
						pos_x: newItem.pos_y,
						pos_y: width_mm - newItem.pos_x - newItem.width,
						width: newItem.height,
						height: newItem.width,
					}
				}

				return newItem
			})
		)
		storeHistory.append(storeTemplate.objects, 'Поворот на 90')
	}
	return (
		<Group gap='xs'>
			<Button
				variant='outline'
				onClick={() => {
					storeTemplates.clear()
					storeTemplate.clear()
					storeHistory.clear()
				}}
			>
				Создать
			</Button>
			<TextInput
				placeholder='Название'
				value={storeTemplate.name}
				error={errorName}
				onChange={({ target }) => {
					storeApp.setErrorName(false)
					storeTemplate.setTemplateName(target.value)
				}}
			/>
			<Button variant='filled' color='green' onClick={() => serviceTemplate.handleSave()}>
				Сохранить
			</Button>

			<Button
				variant='outline'
				onClick={() => {
					storeTemplate.clear(false)
					storeHistory.append(storeTemplate.objects, 'Очистка')
				}}
			>
				Очистить
			</Button>
			<Button variant='outline' onClick={() => storeApp?.setLoadTemplateFlag(true)}>
				Шаблоны
			</Button>
			<Button variant='outline' color={importFlag ? 'lime' : ''} onClick={() => storeApp?.setImportFlag(!importFlag)}>
				Импорт кода
			</Button>
			<Button
				variant='outline'
				color={previewFlag ? 'lime' : ''}
				onClick={() => storeApp?.setPreviewFlag?.(!previewFlag)}
			>
				Предпросмотр
			</Button>
			<Button variant='filled' onClick={handleRotateLeft}>
				<TbRotate2 />
			</Button>
			{/* <Button variant='filled' onClick={handleRotateRight}>
				<TbRotateClockwise2 />
			</Button> */}
		</Group>
	)
})

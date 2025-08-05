import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { ItemEditable } from './ItemEditable'
import { ItemNumber } from './ItemNumber'
import { ItemOptions } from './ItemOptions'

export const ListProperties = observer(() => {
	const { current } = storeTemplate
	const properties = current.properties || []
	const allowProp = useCallback(
		(prop: string) => {
			return properties.includes(prop)
		},
		[properties]
	)

	return (
		<Stack maw='auto' gap={0}>
			{allowProp('name') && (
				<ItemEditable
					editable
					label='Имя:'
					value={current.name}
					placeholder='введите имя'
					type='text'
					onChange={v => storeTemplate.setName(v)}
					onClick={() => console.log('click')}
				/>
			)}
			{allowProp('width') && (
				<ItemNumber
					edit
					label='Ширина:'
					value={current.width}
					step='0.01'
					unit='mm'
					onChange={v => storeTemplate.setWidth(v)}
				/>
			)}
			{allowProp('height') && (
				<ItemNumber
					edit
					label='Высота:'
					value={current.height}
					step='0.01'
					unit='mm'
					onChange={v => storeTemplate.setHeight(v)}
				/>
			)}
			{allowProp('pos_x') && (
				<ItemNumber
					edit
					label='X:'
					value={current.pos_x}
					step='0.01'
					unit='mm'
					onChange={v => storeTemplate.setPosX(v)}
				/>
			)}
			{allowProp('pos_y') && (
				<ItemNumber
					edit
					label='Y:'
					value={current.pos_y}
					step='0.01'
					unit='mm'
					onChange={v => storeTemplate.setPosY(v)}
				/>
			)}
			{allowProp('rotation') && (
				<ItemOptions
					label='Поворот:'
					unit='%'
					options={['0', '90', '180', '270']}
					onChange={v => storeTemplate.setRotation(v)}
					value={current.rotation}
				/>
			)}
			{allowProp('text_align') && <></>}
			{allowProp('human_readable') && <></>}
			{allowProp('radius') && <></>}
			{allowProp('line_thickness') && <></>}
			{allowProp('enabled') && <></>}
			{allowProp('type') && <></>}
			{allowProp('code_type') && <></>}
			{allowProp('font_size') && <></>}
			{allowProp('font_id') && <></>}
			{allowProp('image_id') && <></>}
			{allowProp('data') && <></>}
			{allowProp('font_rel') && <></>}
			{allowProp('image_rel') && <></>}
		</Stack>
	)
})

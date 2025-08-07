import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { STEP } from '../../shared/constants'
import { useAppContext } from '../context'
import { ItemAction } from './item-action'
import { ItemEditable } from './item-editable'
import { ItemNumber } from './item-number'
import { ItemOptions } from './item-options'
import { ItemSwitch } from './item-switch'
import { ItemText } from './item-text'

export const ListProperties = observer(() => {
	const { current } = storeTemplate
	if (!current) {
		return 'Нужно выбрать елемент'
	}
	const ctx = useAppContext()
	const properties = current.properties || []
	const allowProp = (prop: string) => {
		return properties.includes(prop)
	}

	return (
		<Stack maw='auto' gap={0}>
			{allowProp('enabled') && (
				<ItemSwitch
					edit
					label='Активен:'
					checked={current.enabled}
					onChange={val => storeTemplate.setEnabled(val)}
				/>
			)}
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
					edit={current.width !== 'fit-content'}
					label='Ширина:'
					value={
						current.width !== '' ? Math.round(current.width * 100) / 100 : ''
					}
					step={STEP}
					unit='mm'
					onChange={v => storeTemplate.setWidth(v)}
				/>
			)}
			{allowProp('height') && (
				<ItemNumber
					edit={current.height !== 'fit-content'}
					label='Высота:'
					value={
						current.height !== '' ? Math.round(current.height * 100) / 100 : ''
					}
					step={STEP}
					unit='mm'
					onChange={v => storeTemplate.setHeight(v)}
				/>
			)}
			{allowProp('pos_x') && (
				<ItemNumber
					edit
					label='X:'
					value={current.pos_x}
					step={STEP}
					unit='mm'
					onChange={v => storeTemplate.setPosX(v)}
				/>
			)}
			{allowProp('pos_y') && (
				<ItemNumber
					edit
					label='Y:'
					value={current.pos_y}
					step={STEP}
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
			{allowProp('text_align') && (
				<ItemOptions
					label='Позиция:'
					options={[
						{
							value: '1',
							label: 'Слева',
						},
						{
							value: '2',
							label: 'В центре',
						},
						{
							value: '3',
							label: 'Справа',
						},
					]}
					labels={{
						1: 'Слева',
						2: 'В центре',
						3: 'Справа',
					}}
					onChange={v => storeTemplate.setTextAlign(v)}
					value={current.text_align}
				/>
			)}
			{allowProp('font_size') && (
				<ItemNumber
					edit
					label='Размер:'
					value={current.font_size}
					unit='mm'
					onChange={v => storeTemplate.setFontSize(v)}
				/>
			)}
			{allowProp('line_thickness') && (
				<ItemNumber
					edit
					label='Толщина:'
					value={current.line_thickness}
					step={STEP}
					onChange={v => storeTemplate.setLineThickness(v)}
				/>
			)}
			{allowProp('radius') && (
				<ItemNumber
					edit
					label='Скругение:'
					value={current.radius}
					step={STEP}
					onChange={v => storeTemplate.setRadius(v)}
				/>
			)}
			{allowProp('font_id') && (
				<ItemAction
					edit
					label='Шрифт:'
					value={current.fontFamily}
					onClick={() => {
						ctx.setFontFamilyOld(current.font_id)
						ctx.setFontFamilyFlag(true)
					}}
				/>
			)}
			{allowProp('data') && (
				<ItemText
					type={current?.type === 'block' ? 'textarea' : 'text'}
					edit
					placeholder='Введите текст'
					value={current.data}
					onChange={v => storeTemplate.setData(v)}
				/>
			)}

			{allowProp('human_readable') && <></>}

			{allowProp('type') && <></>}
			{allowProp('code_type') && <></>}

			{allowProp('image_id') && <></>}

			{allowProp('font_rel') && <></>}
			{allowProp('image_rel') && <></>}
		</Stack>
	)
})

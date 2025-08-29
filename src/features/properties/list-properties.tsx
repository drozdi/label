import { ActionIcon, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import {
	TbAlignCenter,
	TbAlignLeft,
	TbAlignRight,
	TbBaselineDensitySmall,
	TbX,
} from 'react-icons/tb'
import {
	labelsHumanReadable,
	labelsTextAlign,
} from '../../entites/element/constants'
import {
	histroyAppend,
	histroyAppendDebounce,
} from '../../entites/history/store'
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
			{allowProp('code_type') && (
				<ItemEditable label='Тип кода:' value={current.code_type} />
			)}
			{allowProp('name') && (
				<ItemEditable
					editable
					label='Имя:'
					value={current.name}
					placeholder='введите имя'
					type='text'
					onChange={v => {
						const name = current?.name
						storeTemplate.setName(v)
						histroyAppend(
							storeTemplate.objects,
							`Переименование "${name}" в "${v}"`
						)
					}}
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
					onChange={v => {
						storeTemplate.setWidth(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`"${current?.name}" ширина: ${v}`
						)
					}}
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
					onChange={v => {
						storeTemplate.setHeight(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`"${current?.name}" высота: ${v}`
						)
					}}
				/>
			)}
			{allowProp('pos_x') && (
				<ItemNumber
					edit
					label='X:'
					value={current.pos_x}
					step={STEP}
					unit='mm'
					onChange={v => {
						storeTemplate.setPosX(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Перемещение "${current?.name}" по x в "${v}"`
						)
					}}
				/>
			)}
			{allowProp('pos_y') && (
				<ItemNumber
					edit
					label='Y:'
					value={current.pos_y}
					step={STEP}
					unit='mm'
					onChange={v => {
						storeTemplate.setPosY(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Перемещение "${current?.name}" по y в "${v}"`
						)
					}}
				/>
			)}
			{allowProp('rotation') && (
				<ItemOptions
					label='Поворот:'
					unit='%'
					options={['0', '90', '180', '270']}
					onChange={v => {
						storeTemplate.setRotation(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Поворот "${current?.name}" на ${v}`
						)
					}}
					value={current.rotation}
				/>
			)}
			{allowProp('text_align') && (
				<ItemOptions
					label='Выравнивание:'
					options={[
						{
							value: '1',
							label: <TbAlignLeft title='Слева' />,
						},
						{
							value: '2',
							label: <TbAlignCenter title='В центре' />,
						},
						{
							value: '3',
							label: <TbAlignRight title='Справа' />,
						},
					]}
					labels={labelsTextAlign}
					onChange={v => {
						storeTemplate.setTextAlign(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Выравнивание "${current?.name}": ${labelsTextAlign[v]}`
						)
					}}
					value={current.text_align}
				/>
			)}
			{allowProp('font_size') && (
				<ItemNumber
					edit
					label='Размер:'
					value={current.font_size}
					unit='mm'
					onChange={v => {
						storeTemplate.setFontSize(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Размер текста "${current?.name}": ${v}`
						)
					}}
				/>
			)}
			{allowProp('line_thickness') && (
				<ItemNumber
					edit
					label='Толщина:'
					value={current.line_thickness}
					step={STEP}
					onChange={v => {
						storeTemplate.setLineThickness(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Толщина "${current?.name}": ${value}`
						)
					}}
				/>
			)}
			{allowProp('radius') && (
				<ItemNumber
					edit
					label='Скругение:'
					value={current.radius}
					step={STEP}
					onChange={v => {
						storeTemplate.setRadius(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Радиус "${current?.name}": ${v}`
						)
					}}
				/>
			)}
			{allowProp('font_id') && (
				<ItemAction
					edit
					label='Шрифт:'
					value={current.fontFamily}
					onClick={() => {
						ctx.setFontFamilyFlag(true)
					}}
				/>
			)}
			{allowProp('data') && (
				<ItemText
					type={current?.type === 'block' ? 'textarea' : 'text'}
					edit
					icon={
						<ActionIcon radius={0} onClick={() => ctx.setVariableFlag(true)}>
							<TbBaselineDensitySmall />
						</ActionIcon>
					}
					placeholder='Введите текст'
					value={current.data}
					onChange={v => {
						histroyAppendDebounce(
							storeTemplate.objects,
							`Изменение текста "${current?.data}" в "${v}"`
						)
						storeTemplate.setData(v)
					}}
				/>
			)}
			{allowProp('human_readable') && (
				<ItemOptions
					label='Показывать текст:'
					options={[
						{
							value: '0',
							label: <TbX title='Скрыть' />,
						},
						{
							value: '1',
							label: <TbAlignLeft title='Слева' />,
						},
						{
							value: '2',
							label: <TbAlignCenter title='В центре' />,
						},
						{
							value: '3',
							label: <TbAlignRight title='Справа' />,
						},
					]}
					labels={labelsHumanReadable}
					value={current.human_readable}
					onChange={v => {
						storeTemplate.setHumanReadable(v)
						histroyAppendDebounce(
							storeTemplate.objects,
							`Выравнивание "${current?.name}" - ${labelsHumanReadable[v]}`
						)
					}}
				/>
			)}
			{allowProp('image_id') && (
				<ItemAction
					edit
					label='Изображение:'
					value={current.imageName}
					onClick={() => {
						ctx.setImageFlag(true)
					}}
				/>
			)}
		</Stack>
	)
})

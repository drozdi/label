import { ActionIcon, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useCallback, useMemo } from 'react'
import { TbAlignCenter, TbAlignLeft, TbAlignRight, TbBaselineDensitySmall, TbX } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { allProperties, labelsHumanReadable, labelsTextAlign } from '../../entites/element/constants'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { STEP } from '../../shared/constants'
import { round } from '../../shared/utils'
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
	const properties = useMemo<never[]>(() => {
		if (storeTemplate.isOne()) {
			return current?.properties || {}
		}
		let props = new Set(allProperties)
		storeTemplate.selectedObjects.forEach(o => {
			props = props.intersection(new Set(o.multiProperties))
		})
		return [...props]
	}, [storeTemplate.selected])
	const allowProp = useCallback(
		(prop: string) => {
			return properties.includes(prop)
		},
		[properties]
	)
	const history = useHistory()
	return (
		<Stack maw='auto' gap={0}>
			{allowProp('enabled') && (
				<ItemSwitch edit label='Активен:' checked={current.enabled} onChange={val => storeTemplate.setEnabled(val)} />
			)}
			{allowProp('code_type') && <ItemEditable label='Тип кода:' value={current.code_type} />}
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
						history.append(storeTemplate.objects, `Переименование "${name}" в "${v}"`)
					}}
				/>
			)}
			{allowProp('width') && (
				<ItemNumber
					edit={current.width !== 'fit-content'}
					label='Ширина:'
					value={current.width !== '' ? round(current.width * 100) / 100 : ''}
					step={STEP}
					unit='mm'
					onChange={v => {
						storeTemplate.setWidth(v)
						history.appendDebounce(storeTemplate.objects, `"${current?.name}" ширина: ${v}`)
					}}
				/>
			)}
			{allowProp('height') && (
				<ItemNumber
					edit={current.height !== 'fit-content'}
					label='Высота:'
					value={current.height !== '' ? round(current.height * 100) / 100 : ''}
					step={STEP}
					unit='mm'
					onChange={v => {
						storeTemplate.setHeight(v)
						history.appendDebounce(storeTemplate.objects, `"${current?.name}" высота: ${v}`)
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
						history.appendDebounce(storeTemplate.objects, `Перемещение "${current?.name}" по x в "${v}"`)
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
						history.appendDebounce(storeTemplate.objects, `Перемещение "${current?.name}" по y в "${v}"`)
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
						history.appendDebounce(storeTemplate.objects, `Поворот "${current?.name}" на ${v}`)
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
						history.appendDebounce(storeTemplate.objects, `Выравнивание "${current?.name}": ${labelsTextAlign[v]}`)
					}}
					value={current.text_align}
				/>
			)}
			{allowProp('font_size') && (
				<ItemNumber
					edit
					label='Размер:'
					value={current.font_size}
					unit='px'
					onChange={v => {
						storeTemplate.setFontSize(v)
						history.appendDebounce(storeTemplate.objects, `Размер текста "${current?.name}": ${v}`)
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
						history.appendDebounce(storeTemplate.objects, `Толщина "${current?.name}": ${value}`)
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
						history.appendDebounce(storeTemplate.objects, `Радиус "${current?.name}": ${v}`)
					}}
				/>
			)}
			{allowProp('font_id') && (
				<ItemAction
					edit
					label='Шрифт:'
					value={current.fontFamily}
					onClick={() => {
						storeApp.setFontFamilyFlag(true)
					}}
				/>
			)}
			{allowProp('data') && (
				<ItemText
					type={current?.type === 'block' ? 'textarea' : 'text'}
					edit
					icon={
						<ActionIcon radius={0} onClick={() => storeApp.setVariableFlag(true)}>
							<TbBaselineDensitySmall />
						</ActionIcon>
					}
					placeholder='Введите текст'
					value={current.data}
					onChange={v => {
						history.appendDebounce(storeTemplate.objects, `Изменение текста "${current?.data}" в "${v}"`)
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
						history.appendDebounce(storeTemplate.objects, `Выравнивание "${current?.name}" - ${labelsHumanReadable[v]}`)
					}}
				/>
			)}
			{allowProp('image_id') && (
				<ItemAction
					edit
					label='Изображение:'
					value={current.imageName}
					onClick={() => {
						storeApp.setImageFlag(true)
					}}
				/>
			)}
		</Stack>
	)
})

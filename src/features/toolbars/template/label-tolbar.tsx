import { Group, NumberInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../../entites/template/store'
import { LabelTolbarInput } from './label-tolbar-input'
import { LabelTolbarSelect } from './label-tolbar-select'

const w = 60

export const LabelTolbar = observer(({ template, disabled }) => {
	template = template || storeTemplate
	return (
		<Group fz={13} gap={0} px='sm' justify='space-between'>
			<LabelTolbarSelect
				disabled={disabled}
				w={w * 1.5}
				label='dpi'
				value={String(template.dpi)}
				options={[
					{ value: '12', label: '300' },
					{ value: '8', label: '200' },
				]}
				onChange={v => template.changeDpi?.(v)}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Ширина'
				name='width'
				value={template.width_mm}
				onChange={v => template.changeWidth?.(v)}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Высота'
				name='height'
				value={template.height_mm}
				onChange={v => template.changeHeight?.(v)}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Скругление'
				name='radius'
				value={template.radius_label}
				onChange={v => template.changeRadius?.(v)}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Зазор'
				name='gap'
				value={template.gap_mm}
				onChange={v => template.changeGap?.(v)}
			/>
			<Group gap={0}>
				Направление:
				<NumberInput
					disabled={disabled}
					w={w}
					value={template.direction_x}
					onChange={v => template.changeDirection1?.(v)}
				/>
				,
				<NumberInput
					disabled={disabled}
					w={w}
					value={template.direction_y}
					onChange={v => template.changeDirection2?.(v)}
				/>
			</Group>
			<Group gap={0}>
				Смещение по x:
				<NumberInput
					disabled={disabled}
					w={w}
					value={template.reference_x}
					onChange={v => template.changeRefX?.(v)}
				/>
				y:
				<NumberInput
					disabled={disabled}
					w={w}
					value={template.reference_y}
					onChange={v => template.changeRefY?.(v)}
				/>
			</Group>
		</Group>
	)
})

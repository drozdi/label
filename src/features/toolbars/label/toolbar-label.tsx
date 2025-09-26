import { Group, NumberInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../../entites/template/store'
import { Toolbar } from '../../../shared/ui'
import { LabelTolbarInput } from './label-tolbar-input'
import { LabelTolbarSelect } from './label-tolbar-select'

const w = 60

export const ToolbarLabel = observer(({ disabled, ...props }: { disabled?: boolean; [key: string]: any }) => (
	<Toolbar fz={12} {...props}>
		<LabelTolbarSelect
			disabled={disabled}
			w={w * 1.5}
			label='dpi'
			value={String(storeTemplate.dpi)}
			options={[
				{ value: '12', label: '300' },
				{ value: '8', label: '200' },
			]}
			onChange={v => storeTemplate.changeDpi?.(v)}
		/>
		<LabelTolbarInput
			disabled={disabled}
			w={w}
			label='Ширина'
			name='width'
			value={storeTemplate.width_mm}
			onChange={v => storeTemplate.changeWidth?.(v)}
		/>
		<LabelTolbarInput
			disabled={disabled}
			w={w}
			label='Высота'
			name='height'
			value={storeTemplate.height_mm}
			onChange={v => storeTemplate.changeHeight?.(v)}
		/>
		<LabelTolbarInput
			disabled={disabled}
			w={w}
			label='Скругление'
			name='radius'
			value={storeTemplate.radius_label}
			onChange={v => storeTemplate.changeRadius?.(v)}
		/>
		<LabelTolbarInput
			disabled={disabled}
			w={w}
			label='Зазор'
			name='gap'
			value={storeTemplate.gap_mm}
			onChange={v => storeTemplate.changeGap?.(v)}
		/>
		<Group gap={0}>
			Направление:
			<NumberInput
				disabled={disabled}
				w={w}
				min={0}
				max={1}
				value={storeTemplate.direction_x}
				onChange={v => storeTemplate.changeDirection1?.(v)}
			/>
			,
			<NumberInput
				disabled={disabled}
				w={w}
				min={0}
				max={1}
				value={storeTemplate.direction_y}
				onChange={v => storeTemplate.changeDirection2?.(v)}
			/>
		</Group>
		<Group gap={0}>
			Смещение по x:
			<NumberInput
				min={0}
				disabled={disabled}
				w={w}
				value={storeTemplate.reference_x}
				onChange={v => storeTemplate.changeRefX?.(v)}
			/>
			y:
			<NumberInput
				min={0}
				disabled={disabled}
				w={w}
				value={storeTemplate.reference_y}
				onChange={v => storeTemplate.changeRefY?.(v)}
			/>
		</Group>
	</Toolbar>
))

import { Group, NumberInput, SimpleGrid } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../../entites/template/store'
import { useBreakpoint } from '../../../shared/hooks'
import { Toolbar } from '../../../shared/ui'
import { LabelTolbarInput } from './label-tolbar-input'
import { LabelTolbarSelect } from './label-tolbar-select'

const w = 60

export const ToolbarLabel = observer(({ disabled, ...props }: { disabled?: boolean; [key: string]: any }) => {
	const isMobile = useBreakpoint('xs')
	return (
		<Toolbar fz={12} as={isMobile ? SimpleGrid : undefined} cols={2} {...props}>
			<LabelTolbarSelect
				disabled={disabled}
				w={w * 1.5}
				label='Applicator'
				value={String(storeTemplate.applicator_ezpl ?? -1)}
				options={[
					{ value: '-1', label: 'Нет' },
					{ value: '0', label: '0' },
					{ value: '1', label: '1' },
					{ value: '2', label: '2' },
				]}
				onChange={v => storeTemplate.changeApplicatorEzpl?.(v === '-1' ? null : v)}
			/>
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
			<Group gap={0} justify='space-between'>
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
			<Group gap={0} justify='space-between'>
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
	)
})

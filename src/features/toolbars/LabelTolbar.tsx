import { Group, NumberInput } from '@mantine/core'
import { LabelTolbarInput } from './LabelTolbarInput'
import { LabelTolbarSelect } from './LabelTolbarSelect'

export function LabelTolbar() {
	const w = 60
	return (
		<Group fz={13} gap={0} justify='space-between'>
			<LabelTolbarSelect
				w={w * 1.5}
				label='dpi'
				options={[
					{ value: '12', label: '300' },
					{ value: '8', label: '200' },
				]}
			/>
			<LabelTolbarInput w={w} label='Ширина' />
			<LabelTolbarInput w={w} label='Высота' />
			<LabelTolbarInput w={w} label='Скругление' />
			<LabelTolbarInput w={w} label='Зазор' />
			<Group gap={0}>
				Направление:
				<NumberInput w={w} />
				,
				<NumberInput w={w} />
			</Group>
			<Group gap={0}>
				Смещение по x:
				<NumberInput w={w} />
				y:
				<NumberInput w={w} />
			</Group>
		</Group>
	)
}

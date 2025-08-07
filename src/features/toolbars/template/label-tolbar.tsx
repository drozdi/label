import { Group, NumberInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../../entites/template/store'
import { LabelTolbarInput } from './label-tolbar-input'
import { LabelTolbarSelect } from './label-tolbar-select'

const w = 60

export const LabelTolbar = observer(() => {
	return (
		<Group fz={13} gap={0} justify='space-between'>
			<LabelTolbarSelect
				w={w * 1.5}
				label='dpi'
				value={String(storeTemplate.dpi)}
				options={[
					{ value: '12', label: '300' },
					{ value: '8', label: '200' },
				]}
				onChange={v => storeTemplate.changeDpi(v)}
			/>
			<LabelTolbarInput
				w={w}
				label='Ширина'
				name='width'
				value={storeTemplate.width_label}
				onChange={v => storeTemplate.changeWidth(v)}
			/>
			<LabelTolbarInput
				w={w}
				label='Высота'
				name='height'
				value={storeTemplate.height_label}
				onChange={v => storeTemplate.changeHeight(v)}
			/>
			<LabelTolbarInput
				w={w}
				label='Скругление'
				name='radius'
				value={storeTemplate.radius_label}
				onChange={v => storeTemplate.changeGap(v)}
			/>
			<LabelTolbarInput
				w={w}
				label='Зазор'
				name='gap'
				value={storeTemplate.gap}
				onChange={v => storeTemplate.changeGap(v)}
			/>
			<Group gap={0}>
				Направление:
				<NumberInput
					w={w}
					value={storeTemplate.DIRECTION_1}
					onChange={v => storeTemplate.changeDirection1(v)}
				/>
				,
				<NumberInput
					w={w}
					value={storeTemplate.DIRECTION_2}
					onChange={v => storeTemplate.changeDirection2(v)}
				/>
			</Group>
			<Group gap={0}>
				Смещение по x:
				<NumberInput
					w={w}
					value={storeTemplate.ref_x}
					onChange={v => storeTemplate.changeRefX(v)}
				/>
				y:
				<NumberInput
					w={w}
					value={storeTemplate.ref_y}
					onChange={v => storeTemplate.changeRefY(v)}
				/>
			</Group>
		</Group>
	)
})

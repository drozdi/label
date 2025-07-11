import { Group, Select } from '@mantine/core'

interface LabelTolbarSelectProps {
	w?: number
	label?: string
	value?: string
	options?: any[]
	onChange?: (value: null | string, option: any) => void
}

export function LabelTolbarSelect({
	w = 75,
	label,
	value,
	options = [],
	onChange,
}: LabelTolbarSelectProps) {
	return (
		<Group component='label' gap='xs'>
			{label}
			<Select data={options} value={value} onChange={onChange} w={w} />
		</Group>
	)
}

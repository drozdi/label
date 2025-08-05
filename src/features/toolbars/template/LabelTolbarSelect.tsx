import { Group, Select } from '@mantine/core'

interface LabelTolbarSelectProps {
	w?: number
	label?: string
	name?: string
	options?: any[]
	value?: string
	defaultValue?: string
	onChange?: (value: null | string, option: any) => void
}

export function LabelTolbarSelect({
	w = 75,
	label,
	options = [],
	...props
}: LabelTolbarSelectProps) {
	return (
		<Group component='label' gap='xs'>
			{label}
			<Select {...props} data={options} w={w} />
		</Group>
	)
}

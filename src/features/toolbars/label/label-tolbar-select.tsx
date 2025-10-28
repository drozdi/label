import { Group, Select } from '@mantine/core'

interface LabelTolbarSelectProps {
	w?: number
	label?: string
	name?: string
	options?: any[]
	value?: string
	disabled?: boolean
	defaultValue?: string
	onChange?: (value: null | string, option: any) => void
}

export function LabelTolbarSelect({ disabled, w = 75, label, options = [], ...props }: LabelTolbarSelectProps) {
	return (
		<Group component='label' justify='space-between'>
			{label}
			<Select size='xs' disabled={disabled} {...props} data={options} w={w} />
		</Group>
	)
}

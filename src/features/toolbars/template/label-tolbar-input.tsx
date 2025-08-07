import { Group, NumberInput } from '@mantine/core'

interface LabelTolbarInputProps {
	w?: number
	label?: string
	name?: string
	value?: number
	onChange?: (value: number | string) => void
}

export function LabelTolbarInput({
	w = 50,
	label,
	name,
	value,
	onChange,
}: LabelTolbarInputProps) {
	return (
		<Group component='label' gap='xs'>
			{label}
			<NumberInput value={value} name={name} onChange={onChange} w={w} />
		</Group>
	)
}

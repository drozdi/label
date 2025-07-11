import { Group, NumberInput } from '@mantine/core'

interface LabelTolbarInputProps {
	w?: number
	label?: string
	value?: number
	onChange?: (value: number | string) => void
}

export function LabelTolbarInput({
	w = 50,
	label,
	value,
	onChange,
}: LabelTolbarInputProps) {
	return (
		<Group component='label' gap='xs'>
			{label}
			<NumberInput value={value} onChange={onChange} w={w} />
		</Group>
	)
}

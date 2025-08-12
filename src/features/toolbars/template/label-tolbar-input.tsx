import { Group, NumberInput } from '@mantine/core'

interface LabelTolbarInputProps {
	w?: number
	label?: string
	name?: string
	value?: number
	disabled?: boolean
	onChange?: (value: number | string) => void
}

export function LabelTolbarInput({
	disabled,
	w = 50,
	label,
	name,
	value,
	onChange,
}: LabelTolbarInputProps) {
	return (
		<Group component='label' gap='xs'>
			{label}
			<NumberInput
				min={0}
				disabled={disabled}
				value={value}
				name={name}
				onChange={onChange}
				w={w}
			/>
		</Group>
	)
}

import { Box, Button, Group, NumberInput } from '@mantine/core'

interface ItemNumberProps {
	label?: string
	value?: string | number
	unit?: string
	placeholder?: string
	onChange?: (e: React.MouseEvent) => void
	onClick?: (e: React.MouseEvent) => void
	editable?: boolean
}

export function ItemNumber({
	label,
	value,
	placeholder,
	onChange,
	onClick,
	editable,
	unit,
	...props
}: ItemNumberProps) {
	return (
		<Group gap={0} grow>
			<Box flex='auto' maw='100%'>
				<NumberInput
					placeholder={placeholder}
					value={value}
					onChange={onChange}
				/>
			</Box>
			<Box flex='none' maw='100%'>
				<Button onClick={onClick}>Ок</Button>
			</Box>
		</Group>
	)
}

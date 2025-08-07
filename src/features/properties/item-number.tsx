import { Box, Group, NumberInput } from '@mantine/core'

interface ItemNumberProps {
	label?: string
	value?: string | number
	unit?: string
	placeholder?: string
	onChange?: (e: React.MouseEvent) => void
	edit?: boolean
	[key: string]: any
}

export function ItemNumber({ label, edit, unit, ...other }: ItemNumberProps) {
	return (
		<Group gap={0} grow>
			<Box maw='50%'>{label}</Box>
			<Box flex='auto' ta='right' maw={`${100 - 50}%`}>
				{edit ? <NumberInput rightSection={unit} {...other} /> : 'Нет'}
			</Box>
		</Group>
	)
}

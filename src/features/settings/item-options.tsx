import { Box, Group, SegmentedControl } from '@mantine/core'

interface ItemOptionsProps {
	label?: string
	value?: string
	onChange?: () => void
	options: any[]
	unit?: string
	labels?: {
		[key: string]: string
	}
}

export function ItemOptions({
	label,
	value,
	onChange,
	options,
	unit,
	labels,
}: ItemOptionsProps) {
	return (
		<Group gap={0} grow>
			<Box maw='50%'>{label}</Box>
			<Box
				flex='auto'
				ta='right'
				maw='100%'
				style={{ cursor: 'pointer', color: 'var(--mantine-color-blue-3)' }}
			>
				<SegmentedControl value={value} data={options} onChange={onChange} />
			</Box>
		</Group>)
}


import { Box, Group } from '@mantine/core'

interface ItemNumberProps {
	label?: string
	value?: string | number
	edit?: boolean
	onClick?: () => void
	[key: string]: any
}

export function ItemAction({
	label,
	edit,
	value,
	onClick,
	...other
}: ItemNumberProps) {
	return (
		<Group gap={0} grow>
			<Box maw='50%'>{label}</Box>
			<Box flex='auto' ta='right' maw={`${100 - 50}%`}>
				{edit ? (
					<span
						onClick={onClick}
						style={{
							cursor: 'pointer',
							color: 'var(--mantine-color-blue-3)',
						}}
					>
						{value}
					</span>
				) : (
					<span>{value}</span>
				)}
			</Box>
		</Group>
	)
}

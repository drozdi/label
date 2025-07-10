import { observer } from 'mobx-react-lite'

import { Box, Group, Input } from '@mantine/core'

interface ItemFieldProps {
	edit: boolean
	label?: string
	value?: string | number
	unit?: string
	type?: string
	placeholder?: string
	onChange?: (value: any) => void
}

export const ItemField = observer(
	({
		edit,
		label,
		value,
		type,
		unit,
		placeholder,
		onChange,
	}: ItemFieldProps) => {
		return (
			<Group gap={0} grow>
				<Box maw='50%'>{label}</Box>
				<Box flex='auto' ta='right' maw={`${100 - 50}%`}>
					{edit ? (
						<Input
							type={type}
							placeholder={placeholder}
							rightSection={unit}
							value={value}
							onChange={e => onChange?.(e.target.value)}
						/>
					) : (
						'Нет'
					)}
				</Box>
			</Group>
		)
	}
)

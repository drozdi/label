import { observer } from 'mobx-react-lite';

import { Box, Group, Input } from '@mantine/core';

interface ItemFieldProps {
	edit: boolean,
	label?: string,
	value?: string | number,
	unit?: string,
	type?: string,
	placeholder?: string,
	onChange?: () => void,
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
				<Box>{label}</Box>
				<Box flex="auto" ta="right" maw="100%">
					{edit ? (
						<Input
							variant="filled"
							size="xs" radius={0}
							type={type}
							placeholder={placeholder}
							rightSection={unit}
							value={value}
							onChange={onChange}
							/>) : 'Нет'}
				</Box>
			</Group>
		)
	}
)

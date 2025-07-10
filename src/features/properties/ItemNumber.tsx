
import { Box, Button, Group, NumberInput } from '@mantine/core';

interface ItemNumberProps {
	label?: string,
	value?: string | number,
	unit?: string,
	placeholder?: string,
	onChange?: () => void,
	onClick?: () => void,
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
}: ItemNumberProps ) {
	return <Group gap={0} grow>
		<Box flex="auto" maw="100%">
			<NumberInput
				variant="filled"
				size="xs" radius={0}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				/>
		</Box>
		<Box flex="none" maw="100%">
			<Button variant="subtle" size="xs" radius={0} onClick={onClick}>
				Ок
			</Button>
		</Box>	
	</Group>;
}
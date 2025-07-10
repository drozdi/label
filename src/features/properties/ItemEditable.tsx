import { useState } from 'react';

import { Box, Button, Group, Input } from '@mantine/core';

interface ItemEditableProps {
	label?: string,
	value?: string | number,
	unit?: string,
	type?: string,
	placeholder?: string,
	onChange?: () => void,
	onClick?: () => void,
	editable?: boolean
}

export function ItemEditable({
	label,
	value,
	type,
	placeholder,
	onChange,
	onClick,
	editable,
	unit,
	...props
}: ItemEditableProps) {
	const [edit, setEdit] = useState<boolean>(false)
	return <Group gap={0} grow>
		{editable && edit? <>
			<Box flex="auto" maw="100%">
				<Input
					variant="filled"
					size="xs" radius={0}
					type={type}
					placeholder={placeholder}
					rightSection={unit}
					value={value}
					onChange={onChange}
					/>
			</Box>
			<Box flex="none" maw="100%">
				<Button size="xs" radius={0} variant="subtle" onClick={(event) => {
					setEdit(false)
					onClick?.(event)
				}}>
					Ок
				</Button>
			</Box>	
		</>: <>
			<Box flex="auto" maw="100%">
				{label}
			</Box>
			<Box flex="auto" maw="100%" onClick={() => setEdit(true)} style={
				editable? { 
					cursor: 'pointer',
					color: 'var(--mantine-color-blue-3)' 
				}: {}
			}>
				{value}
			</Box>
		</>}
		
	</Group>;
}
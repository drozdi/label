import { useEffect, useState } from 'react'

import { Box, Button, Group, TextInput } from '@mantine/core'

interface ItemEditableProps {
	label?: string
	value?: string | number
	unit?: string
	type?: string
	placeholder?: string
	onChange?: (value: any) => void
	onClick?: () => void
	editable?: boolean
}

export function ItemEditable({
	label,
	value: defaultValue,
	type = 'text',
	placeholder,
	onChange,
	onClick,
	editable,
	unit,
	...other
}: ItemEditableProps) {
	const [edit, setEdit] = useState<boolean>(false)
	const [value, setValue] = useState<string | number | undefined>(defaultValue)
	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	return (
		<Group gap={0} grow>
			{editable && edit ? (
				<TextInput
					type={type}
					placeholder={placeholder}
					rightSection={
						<Box flex='none' maw='100%'>
							<Button
								variant='filled'
								onClick={() => {
									setEdit(false)
									onChange?.(value)
									onClick?.()
								}}
							>
								Ок
							</Button>
						</Box>
					}
					value={value}
					onChange={({ target }) => setValue(target.value)}
				/>
			) : (
				<>
					<Box flex='auto' maw='50%'>
						{label}
					</Box>
					<Box
						flex='auto'
						maw='100%'
						onClick={() => setEdit(true)}
						ta='right'
						style={
							editable
								? {
										cursor: 'pointer',
										color: 'var(--mantine-color-blue-3)',
									}
								: {}
						}
					>
						{value}
					</Box>
				</>
			)}
		</Group>
	)
}

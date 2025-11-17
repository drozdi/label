import { useEffect, useState } from 'react'

import { Box, Button, Group, Input } from '@mantine/core'

interface ItemEditableProps {
	label?: string
	value?: string | number
	unit?: string
	type?: string
	placeholder?: string
	onChange?: (value: any) => void
	onClick?: () => void
	onEdit?: (edit: boolean) => void
	editable?: boolean
	edit?: boolean
	[other: string]: any
}

export function ItemEditable({
	label,
	value,
	type = 'text',
	placeholder,
	onChange,
	onClick,
	onEdit,
	editable,
	unit,
	edit: propEdit = false,
	...other
}: ItemEditableProps) {
	const [edit, setEdit] = useState<boolean>(propEdit)
	useEffect(() => {
		setEdit(propEdit)
	}, [propEdit])
	useEffect(() => {
		onEdit?.(edit)
	}, [edit])
	return (
		<Group gap={0} grow>
			{editable && edit ? (
				<>
					<Box flex='auto' maw='100%'>
						<Input
							type={type}
							placeholder={placeholder}
							rightSection={unit}
							value={value}
							onChange={({ target }) => onChange?.(target.value)}
						/>
					</Box>
					<Box flex='none' maw='100%'>
						<Button
							onClick={() => {
								setEdit(false)
								onClick?.()
							}}
						>
							Ок
						</Button>
					</Box>
				</>
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
										color: 'var(--mantine-color-blue-6)',
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

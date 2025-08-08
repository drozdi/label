import { TextInput, Textarea } from '@mantine/core'

interface ItemTextProps {
	type?: 'textarea' | 'text'
	value?: string | number
	icon?: React.ReactNode
	placeholder?: string
	onChange?: (e: string) => void
	edit?: boolean
	[key: string]: any
}

export function ItemText({
	edit,
	type,
	icon,
	onChange,
	...other
}: ItemTextProps) {
	return type === 'textarea' ? (
		<Textarea
			rows={4}
			disabled={!edit}
			rightSection={icon}
			onChange={({ target }) => onChange?.(target.value)}
			{...other}
		/>
	) : (
		<TextInput
			disabled={!edit}
			rightSection={icon}
			onChange={({ target }) => onChange?.(target.value)}
			{...other}
		/>
	)
}

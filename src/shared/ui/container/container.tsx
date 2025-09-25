import { CloseButton, Group, Stack } from '@mantine/core'

export function Container({
	as: Tag = Stack,
	children,
	onClose,
	label,
	...props
}: {
	as?: React.ReactElement
	children: React.ReactNode
	onClose?: () => void
	label: string
}) {
	return (
		<Tag h='100%' {...props}>
			<Group
				justify='space-between'
				pos='sticky'
				bg='var(--mantine-color-body)'
				top={0}
				ta='center'
				pb='xs'
				style={{
					zIndex: 10,
				}}
			>
				{label}
				{onClose && <CloseButton onClick={onClose} />}
			</Group>
			{children}
		</Tag>
	)
}

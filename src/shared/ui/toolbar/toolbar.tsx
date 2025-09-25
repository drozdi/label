import { Group } from '@mantine/core'

export function Toolbar({
	as: Tag = Group,
	children,
	...props
}: {
	as?: React.ReactElement
	children: React.ReactNode
}) {
	return <Tag {...props}>{children}</Tag>
}

import { Group } from '@mantine/core'

export function Header({
	as: Tag = Group,
	children,
	...props
}: {
	as?: React.ReactElement
	children: React.ReactNode
	[key: string]: any
}) {
	return <Tag {...props}>{children}</Tag>
}

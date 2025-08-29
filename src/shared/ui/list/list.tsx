import { Stack } from '@mantine/core'

export const List = ({ children, ...props }: Record<string, any>) => {
	return (
		<Stack gap='xs' {...props}>
			{children}
		</Stack>
	)
}

import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

export function useBreakpoint(size = 'xs') {
	const theme = useMantineTheme()
	return useMediaQuery(`(max-width: ${theme.breakpoints[size]})`)
}

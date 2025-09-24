import { Box, Button, ScrollArea, Stack } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../entites/app/store'
import { ProvideGuideLine } from '../services/guide-line/context'
import { MEDIA_MOBILE } from '../shared/constants'

export const Layout = observer(
	({
		children,
		leftSection,
		rightSection,
	}: {
		children: React.ReactNode
		leftSection: React.ReactNode
		rightSection: React.ReactNode
	}) => {
		const [opened, { toggle, close }] = useDisclosure(false)
		const isMobile = useMediaQuery(MEDIA_MOBILE)

		return (
			<Box
				h='100%'
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(min-content, auto) minmax(auto, 1fr) minmax(min-content, auto)',
					gridTemplateRows: '1fr',
					overflow: 'hidden',
					width: '100%',
				}}
			>
				<Stack
					h='100%'
					maw='18rem'
					gap='0'
					justify='space-between'
					style={{
						borderRight: '1px solid var(--mantine-color-default-border)',
						overflowX: 'hidden',
						overflowY: 'auto',
					}}
				>
					<Box
						h='100%'
						style={{
							overflowX: 'hidden',
							overflowY: 'auto',
						}}
					>
						{leftSection}
					</Box>
					{import.meta.env.DEV && (
						<Button
							fullWidth
							onClick={() => storeApp.setJsonCodeFlag(true)}
							style={{
								borderTop: '1px solid var(--mantine-color-default-border)',
							}}
						>
							JsonCode
						</Button>
					)}
				</Stack>
				<ScrollArea h='100%' p='xs' pt='0'>
					<ProvideGuideLine>{children}</ProvideGuideLine>
				</ScrollArea>
				<Stack
					h='100%'
					maw='18rem'
					gap='0'
					justify='space-between'
					style={{
						borderRight: '1px solid var(--mantine-color-default-border)',
						overflowX: 'hidden',
						overflowY: 'auto',
					}}
				>
					<Box
						h='100%'
						w='18rem'
						maw='18rem'
						style={{
							overflowX: 'hidden',
							overflowY: 'auto',
							borderLeft: '1px solid var(--mantine-color-default-border)',
						}}
					>
						{rightSection}
					</Box>
				</Stack>
			</Box>
		)
	}
)

import { ActionIcon, Box, Button, Drawer, ScrollArea, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbCirclePlus } from 'react-icons/tb'
import { storeApp } from '../entites/app/store'
import { ProvideGuideLine } from '../services/guide-line/context'
import { useBreakpoint } from '../shared/hooks'

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
		const isMobile = useBreakpoint('xs')

		return (
			<Box
				h='100%'
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(min-content, auto) minmax(auto, 1fr) minmax(min-content, auto)',
					gridTemplateRows: '1fr',
					overflow: 'hidden',
					width: '100%',
					borderTop: '1px solid var(--mantine-color-default-border)',
				}}
			>
				{leftSection ? (
					<>
						<Stack
							component={isMobile ? Drawer : ''}
							position='left'
							opened={storeApp.leftMenuFlag}
							onClose={() => storeApp.setLeftMenuFlag(false)}
							withCloseButton={true}
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
						{isMobile && (
							<ActionIcon m='xs' onClick={() => storeApp.setLeftMenuFlag(true)}>
								<TbCirclePlus />
							</ActionIcon>
						)}
					</>
				) : (
					<div></div>
				)}

				<ScrollArea h='100%' p='xs' pt='0'>
					<ProvideGuideLine>{children}</ProvideGuideLine>
				</ScrollArea>
				{rightSection && (
					<Stack
						component={isMobile ? Drawer : ''}
						opened={storeApp.rightMenuFlag}
						onClose={() => storeApp.setRightMenuFlag(false)}
						withCloseButton={true}
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
							w={isMobile ? '' : '18rem'}
							maw={isMobile ? '' : '18rem'}
							style={{
								overflowX: 'hidden',
								overflowY: 'auto',
								borderLeft: isMobile ? '' : '1px solid var(--mantine-color-default-border)',
							}}
						>
							{rightSection}
						</Box>
					</Stack>
				)}
			</Box>
		)
	}
)

import {
	ActionIcon,
	Box,
	Burger,
	Button,
	Drawer,
	Group,
	Popover,
	Stack,
	useComputedColorScheme,
	useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { TbMoon, TbQuestionMark, TbSettings, TbSun } from 'react-icons/tb'
import { storeApp } from '../entites/app/store'
import { storeTemplate } from '../entites/template/store'
import { HeaderMain } from '../features/header/header-main'
import { HeaderPrint } from '../features/header/header-print'
import { HeaderTemplates } from '../features/header/header-templates'
import { Info } from '../features/info/info'
import { useBreakpoint } from '../shared/hooks'

export const Header = observer(({ leftSection, rightSection }) => {
	const { loadTemplateFlag, settingsFlag } = storeApp
	const [openedInfo, info] = useDisclosure(false)
	const { setColorScheme } = useMantineColorScheme()
	const computedColorScheme = useComputedColorScheme('light', {
		getInitialValueInEffect: true,
	})
	const isMobile = useBreakpoint('xs')
	return (
		<>
			{isMobile && (
				<Stack p='xs'>
					<Burger size='xs' />
				</Stack>
			)}
			<Box component={isMobile ? Drawer : ''}>
				<Stack p={'xs'}>
					<Group component={isMobile ? Stack : Group} align='stretch' justify='space-between'>
						{leftSection}
						{loadTemplateFlag ? <HeaderTemplates /> : <HeaderMain />}
						{!loadTemplateFlag && <HeaderPrint />}
						<Group>
							{!storeApp.offlineMode && (
								<ActionIcon color={settingsFlag ? 'lime' : ''} onClick={() => storeApp.setSettingsFlag(!settingsFlag)}>
									<TbSettings />
								</ActionIcon>
							)}

							<Popover position='bottom' offset={0} shadow='md' opened={openedInfo}>
								<Popover.Target>
									<ActionIcon color={openedInfo ? 'lime' : ''} onMouseEnter={info.open} onMouseLeave={info.close}>
										<TbQuestionMark />
									</ActionIcon>
								</Popover.Target>
								<Popover.Dropdown onMouseEnter={info.open} onMouseLeave={info.close}>
									<Info />
								</Popover.Dropdown>
							</Popover>

							<ActionIcon
								onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
								variant='default'
								aria-label='Toggle color scheme'
							>
								<TbSun
									style={{
										display: computedColorScheme === 'light' ? 'block' : 'none',
									}}
								/>
								<TbMoon
									style={{
										display: computedColorScheme === 'dark' ? 'block' : 'none',
									}}
								/>
							</ActionIcon>
							{import.meta.env.DEV && (
								<Button
									onClick={() =>
										console.log({
											...storeTemplate,
											objects: storeTemplate.objects.map(o => o.getProps()),
										})
									}
								>
									check
								</Button>
							)}
						</Group>
						{rightSection}
					</Group>
				</Stack>
			</Box>
		</>
	)
})

import {
	ActionIcon,
	Group,
	List,
	Popover,
	useComputedColorScheme,
	useMantineColorScheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
	TbArrowDown,
	TbArrowLeft,
	TbArrowRight,
	TbArrowUp,
	TbMoon,
	TbQuestionMark,
	TbSettings,
	TbSun,
} from 'react-icons/tb'
import { useAppContext } from '../features/context'
import { HeaderMain } from '../features/header/header-main'
import { HeaderPrint } from '../features/header/header-print'
import { HeaderTemplates } from '../features/header/header-templates'

export function Header() {
	const ctx = useAppContext()
	const { loadTemplateFlag, settingsFlag } = ctx
	const [openedInfo, info] = useDisclosure(false)
	const { setColorScheme } = useMantineColorScheme()
	const computedColorScheme = useComputedColorScheme('light', {
		getInitialValueInEffect: true,
	})
	return (
		<Group justify='space-between' gap='xs' p='xs'>
			{loadTemplateFlag ? <HeaderTemplates /> : <HeaderMain />}
			{loadTemplateFlag ? null : <HeaderPrint />}
			<Group>
				<ActionIcon
					color={settingsFlag ? 'lime' : ''}
					onClick={() => ctx.setSettingsFlag(!settingsFlag)}
				>
					<TbSettings />
				</ActionIcon>

				<Popover position='bottom' withArrow shadow='md' opened={openedInfo}>
					<Popover.Target>
						<ActionIcon onMouseEnter={info.open} onMouseLeave={info.close}>
							<TbQuestionMark />
						</ActionIcon>
					</Popover.Target>
					<Popover.Dropdown>
						<List spacing='xs' size='sm' center>
							<List.Item>
								"Shift" - для сохранения пропорций при редактирование
							</List.Item>
							<List.Item>"Ctrl" - для выделения элементов</List.Item>
							<List.Item>"Del" - удалить выбранные элемент</List.Item>
							<List.Item>"Ctrl" + "z" - Отменить последнее действие</List.Item>
							<List.Item>"Ctrl" + "y" - Вернуть отменённое действие</List.Item>
							<List.Item>
								"<TbArrowDown />,
								<TbArrowUp />,
								<TbArrowLeft />,
								<TbArrowRight />" - смещение по "x" и "y" координатам выбранного
								элемента
							</List.Item>
						</List>
					</Popover.Dropdown>
				</Popover>

				<ActionIcon
					onClick={() =>
						setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')
					}
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
				{/* <Button
					onClick={() =>
						console.log({
							...storeTemplate,
							objects: [...storeTemplate.objects],
						})
					}
				>
					check
				</Button> */}
			</Group>
		</Group>
	)
}

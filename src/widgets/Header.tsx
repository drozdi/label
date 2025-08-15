import { ActionIcon, Button, Group, List, Popover } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
	TbArrowDown,
	TbArrowLeft,
	TbArrowRight,
	TbArrowUp,
	TbQuestionMark,
	TbSettings,
} from 'react-icons/tb'
import { storeTemplate } from '../entites/template/store'
import { useAppContext } from '../features/context'
import { HeaderMain } from '../features/header/header-main'
import { HeaderTemplates } from '../features/header/header-templates'

export function Header() {
	const ctx = useAppContext()
	const { loadTemplateFlag, settingsFlag } = ctx
	const [openedInfo, info] = useDisclosure(false)
	return (
		<Group justify='space-between'>
			{loadTemplateFlag ? <HeaderTemplates /> : <HeaderMain />}
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
				<Button
					onClick={() =>
						console.log({
							...storeTemplate,
							objects: [...storeTemplate.objects],
						})
					}
				>
					check
				</Button>
			</Group>
		</Group>
	)
}

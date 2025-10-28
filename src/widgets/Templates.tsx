import { ActionIcon, Box, Button, Center, Group, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { TbList } from 'react-icons/tb'
import { storeApp } from '../entites/app/store'
import { storeTemplate } from '../entites/template/store'
import { storeTemplates } from '../entites/templates/store'
import { Band } from '../features/band/band'
import { ContainerTemplate } from '../features/templates/container-template'
import { Preview } from '../features/templates/preview'
import { useHistory } from '../services/history/hooks/use-history'
import { useBreakpoint } from '../shared/hooks'
import { Layout } from './Layout'

export const Templates = observer(() => {
	const { selected: templateSelected } = storeTemplates
	const { objects = [] } = templateSelected || {}
	const history = useHistory()

	useEffect(() => {
		if (templateSelected?.id) {
			storeTemplates.selectTemplate(templateSelected?.id || 0)
		}
	}, [templateSelected?.id])

	const handleSelect = () => {
		history.clear()
		storeTemplate.loadTemplate(storeTemplates.selected)
		storeApp?.setLoadTemplateFlag(false)
	}
	const handleCopy = () => {
		storeTemplate.loadTemplate(storeTemplates.selected, true)
		storeApp?.setLoadTemplateFlag(false)
	}
	const handleExport = async () => {
		storeTemplates.exportTemplate()
	}
	const handleDelete = async () => {
		modals.openConfirmModal({
			title: `Вы уверены? Что хотитее удалить "${templateSelected.name}"`,
			labels: { confirm: 'Удалить шаблон', cancel: 'Нет' },
			//onCancel: () => console.log('Cancel'),
			onConfirm: async () => {
				const id = templateSelected.id
				if (!(await storeTemplates.deleteTemplate(id))) {
					return
				}
				if (storeTemplate.id === id) {
					storeTemplate.id = 0
				}
			},
			confirmProps: {
				variant: 'filled',
				color: 'red',
			},
			cancelProps: {
				variant: 'filled',
			},
		})
	}

	useEffect(() => {
		storeApp.setLeftMenuFlag(true)
	}, [])

	const action = (
		<>
			<Button variant='outline' onClick={handleSelect}>
				Выбрать
			</Button>
			<Button variant='outline' onClick={handleCopy}>
				Копировать
			</Button>
			<Button variant='outline' onClick={handleExport}>
				Экспортировать
			</Button>
			<Button variant='outline' color='red' onClick={handleDelete}>
				Удалить
			</Button>
		</>
	)
	const isMobile = useBreakpoint('xs')
	return (
		<>
			{isMobile && (
				<Group p='xs' pt='0' justify='space-between'>
					<ActionIcon color={storeApp.leftMenuFlag ? 'lime' : ''} onClick={() => storeApp.setLeftMenuFlag(true)}>
						<TbList />
					</ActionIcon>
					{action}
				</Group>
			)}
			<Layout
				style={{
					borderTop: '1px solid var(--mantine-color-default-border)',
				}}
				leftSection={<ContainerTemplate />}
				rightSection={(templateSelected?.id ?? 0) > 0 && <Stack p='xs'>{action}</Stack>}
			>
				<Box h='100%'>
					{storeTemplates.selected ? (
						<Band template={templateSelected}>
							<Preview objects={objects} template={templateSelected} />
						</Band>
					) : (
						<Center h='100%' w='100%'>
							<Text c='dimmed' size='xl'>
								{storeTemplates.list.length > 0 ? (
									<>
										Выберите шаблон из списка слева, для предпросмотра. Ваш текуший шаблон не перезапишется, пока не
										нажмёте кнопку "Выбрать шаблон"
									</>
								) : (
									<>
										В базе данных шаблоны отсутствуют. Создайте Ваш первый шаблон, сохраните и он отобразиться всписке.
									</>
								)}
							</Text>
						</Center>
					)}
				</Box>
			</Layout>
		</>
	)
})

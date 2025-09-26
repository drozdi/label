import { Box, Button, Center, Group, ScrollArea, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../entites/app/store'
import { storeHistory } from '../entites/history/store'
import { storeTemplate } from '../entites/template/store'
import { storeTemplates } from '../entites/templates/store'
import { Band } from '../features/band/band'
import { ListTemplate } from '../features/templates/list-template'
import { Preview } from '../features/templates/preview'

export const Templates = observer(() => {
	const { selected: templateSelected } = storeTemplates
	const { objects = [] } = templateSelected || {}

	useEffect(() => {
		if (templateSelected?.id) {
			storeTemplates.selectTemplate(templateSelected?.id || 0)
		}
	}, [templateSelected?.id])

	const handleSelect = () => {
		storeHistory.clear()
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
				await storeTemplates.deleteTemplate(templateSelected.id)
				if (storeTemplate.id === templateSelected.id) {
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

	return (
		<>
			<Group
				grow
				justify='space-between'
				h='100%'
				style={{
					borderTop: '1px solid var(--mantine-color-default-border)',
				}}
			>
				<ScrollArea h='100%' flex='none' w='18rem' p='xs'>
					<ListTemplate />
				</ScrollArea>
				<ScrollArea maw='50%' flex='auto' w='auto' h='100%'>
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
											В базе данных шаблоны отсутствуют. Создайте Ваш первый шаблон, сохраните и он отобразиться
											всписке.
										</>
									)}
								</Text>
							</Center>
						)}
					</Box>
				</ScrollArea>
				<Box
					flex='none'
					w='18rem'
					maw='100%'
					h='100%'
					p='xs'
					style={{
						overflowX: 'hidden',
						overflowY: 'auto',
					}}
				>
					{(templateSelected?.id || 0) > 0 && (
						<Stack>
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
						</Stack>
					)}
				</Box>
			</Group>
		</>
	)
})

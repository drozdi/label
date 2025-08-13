import {
	Box,
	Button,
	Center,
	Group,
	ScrollArea,
	Stack,
	Text,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeTemplate } from '../entites/template/store'
import { storeTemplates } from '../entites/templates/store'
import { useAppContext } from '../features/context'
import { Band } from '../features/template/band'
import { ListTemplate } from '../features/templates/list-template'
import { Preview } from '../features/templates/preview'
import { LabelTolbar } from '../features/toolbars/template/label-tolbar'

export const Templates = observer(() => {
	const ctx = useAppContext()
	const { selected: templateSelected } = storeTemplates
	const { objects = [] } = templateSelected || {}

	useEffect(() => {
		if (templateSelected?.id) {
			storeTemplates.selectTemplate(templateSelected?.id)
		}
	}, [templateSelected?.id])

	const handleSelect = () => {
		storeTemplate.loadTemplate(storeTemplates.selected)
		storeTemplates.clear()
		ctx?.setLoadTemplateFlag(false)
	}
	const handleCopy = () => {
		storeTemplate.loadTemplate(storeTemplates.selected, true)
		storeTemplates.clear()
		ctx?.setLoadTemplateFlag(false)
	}
	const handleExport = async () => {
		storeTemplates.exportTemplate()
	}
	const handleDelete = async () => {
		modals.openConfirmModal({
			title: `Вы уверены? Что хотитее удалить "${templateSelected.name}"`,
			labels: { confirm: 'Удалить шаблон', cancel: 'Нет' },
			confirmProps: { color: 'red' },
			//onCancel: () => console.log('Cancel'),
			onConfirm: async () => {
				await storeTemplates.deleteTemplate(templateSelected.id)
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
			<Box>
				<LabelTolbar template={templateSelected} />
			</Box>
			<Group grow justify='space-between' h='100%'>
				<ScrollArea h='100%' flex='none' w='18rem' px='sm'>
					<ListTemplate />
				</ScrollArea>

				<Box maw='50%' flex='auto' w='auto' h='100%'>
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
											Выберите шаблон из списка слева, для предпросмотра. Ваш
											текуший шаблон не перезапишется, пока не нажмёте кнопку
											"Выбрать шаблон"
										</>
									) : (
										<>
											В базе данных шаблоны отсутствуют. Создайте Ваш первый
											шаблон, сохраните и он отобразиться всписке.
										</>
									)}
								</Text>
							</Center>
						)}
					</Box>
				</Box>
				<Box
					flex='none'
					w='18rem'
					maw='100%'
					h='100%'
					px='xs'
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

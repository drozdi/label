import { Box, Button, Center, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../entites/app/store'
import { storeTemplate } from '../entites/template/store'
import { storeTemplates } from '../entites/templates/store'
import { Band } from '../features/band/band'
import { ContainerTemplate } from '../features/templates/container-template'
import { Preview } from '../features/templates/preview'
import { useHistory } from '../services/history/hooks/use-history'
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
		console.log({ ...storeTemplates.selected })
		storeTemplate.loadTemplate(storeTemplates.selected)
		console.log({ ...storeTemplate })
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
		<Layout
			style={{
				borderTop: '1px solid var(--mantine-color-default-border)',
			}}
			leftSection={<ContainerTemplate />}
			rightSection={
				(templateSelected?.id || 0) > 0 && (
					<Stack p='xs'>
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
				)
			}
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
								<>В базе данных шаблоны отсутствуют. Создайте Ваш первый шаблон, сохраните и он отобразиться всписке.</>
							)}
						</Text>
					</Center>
				)}
			</Box>
		</Layout>
	)
})

import { Button, Group, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceNotifications } from '../../services/notifications/service'
import { DEF_TEMPLATE } from '../../shared/constants'
import { useAppContext } from '../context'

export const HeaderMain = observer(() => {
	const ctx = useAppContext()
	const { importFlag, previewFlag } = ctx
	const [errorName, setErrorName] = useState<boolean>(false)
	const handleSave = async () => {
		if (storeTemplate.name?.length < 3) {
			serviceNotifications.error(
				'Название шаблона должно быть не менее 3 символов'
			)
			setErrorName(true)
			return
		}
		if (storeTemplate.objects.length === 0) {
			serviceNotifications.error('Шаблон не может быть пустым')
			return
		}
		const template = {
			...DEF_TEMPLATE,
			...storeTemplate,
			objects: storeTemplate.objects.map(item => ({
				...item.getProps(),
			})),
			scale: undefined,
			dpi: undefined,
			mm: undefined,
			cm: undefined,
			mm_qr: undefined,
			currId: undefined,
			currIndex: undefined,
			selected: undefined,
		}
		if (storeTemplate.id > 0) {
			await handleUpdate(template)
		} else {
			await handleNew(template)
		}
	}
	const handleUpdate = async template => {
		try {
			await storeTemplates.updateTemplate(template)
			serviceNotifications.success('Шаблон успешно изменён')
		} catch (error) {
			serviceNotifications.error(error)
		}
	}
	const handleNew = async template => {
		try {
			const res = await storeTemplates.newTemplate(template)
			storeTemplate.loadTemplate(res.data)
			serviceNotifications.success('Шаблон успешно сохранён')
		} catch (error) {
			serviceNotifications.error(error)
		}
	}
	return (
		<Group gap='xs'>
			<Button
				variant='outline'
				onClick={() => {
					storeTemplates.clear()
					storeTemplate.clear()
					storeHistory.clear()
				}}
			>
				Создать
			</Button>
			<TextInput
				placeholder='Название'
				value={storeTemplate.name}
				error={errorName}
				onChange={({ target }) => {
					setErrorName(false)
					storeTemplate.setTemplateName(target.value)
				}}
			/>
			<Button variant='filled' color='green' onClick={handleSave}>
				Сохранить
			</Button>

			<Button
				variant='outline'
				onClick={() => {
					storeTemplate.clear(false)
					storeHistory.append(storeTemplate.objects, 'Очистка')
				}}
			>
				Очистить
			</Button>
			<Button variant='outline' onClick={() => ctx?.setLoadTemplateFlag(true)}>
				Шаблоны
			</Button>
			<Button
				variant='outline'
				color={importFlag ? 'lime' : ''}
				onClick={() => ctx?.setImportFlag(!importFlag)}
			>
				Импорт кода
			</Button>
			<Button
				variant='outline'
				color={previewFlag ? 'lime' : ''}
				onClick={() => ctx?.setPreviewFlag?.(!previewFlag)}
			>
				Предпросмотр
			</Button>
		</Group>
	)
})

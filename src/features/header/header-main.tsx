import { Button, Group, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { serviceNotifications } from '../../entites/notifications/service'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { DEF_TEMPLATE } from '../../shared/constants'
import { useAppContext } from '../context'

export const HeaderMain = observer(() => {
	const ctx = useAppContext()
	const { importFlag } = ctx
	const handleSave = async () => {
		if (storeTemplate.name?.length < 3) {
			serviceNotifications.error(
				'Название шаблона должно быть не менее 3 символов'
			)
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
				mm: undefined,
				cm: undefined,
				mm_qr: undefined,
				font_rel: undefined,
				image_rel: undefined,
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
		} catch (e) {
			serviceNotifications.error(e.message)
		}
	}
	const handleNew = async template => {
		try {
			const res = await storeTemplates.newTemplate(template)
			storeTemplate.loadTemplate(res.data)
		} catch (e) {
			serviceNotifications.error(e.message)
		}
	}
	return (
		<Group gap='sm' p='sm'>
			<TextInput
				placeholder='Название'
				value={storeTemplate.name}
				onChange={({ target }) => storeTemplate.setTemplateName(target.value)}
			/>
			<Button variant='outline' onClick={() => storeTemplate.clear()}>
				Создать
			</Button>
			<Button variant='outline' onClick={handleSave}>
				Сохранить
			</Button>
			<Button variant='outline' onClick={() => storeTemplate.clear(false)}>
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
		</Group>
	)
})

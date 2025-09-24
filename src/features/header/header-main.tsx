import { Button, Group, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceTemplate } from '../../services/template/service'
import { NEW_TEMPLATE_NAME } from '../../shared/constants'

export const HeaderMain = observer(() => {
	const newTemplate = async () => {
		storeTemplates.clear()
		storeTemplate.clear()
		storeHistory.clear()
		await storeTemplates.load(true)
		let prefix = -1
		storeTemplates.list.map(template => {
			const res = new RegExp(NEW_TEMPLATE_NAME + ' *(?<n>[0-9]*)').exec(template.name)
			if (res) {
				prefix = Math.max(prefix, Number(res.groups.n) || 0)
			}
		})
		storeTemplate.setTemplateName(NEW_TEMPLATE_NAME + (prefix > -1 ? ` ${prefix + 1}` : ''))
		storeApp.setErrorName(false)
	}
	return (
		<Group>
			<Button variant='outline' onClick={newTemplate}>
				Создать
			</Button>
			<TextInput
				placeholder='Название'
				value={storeTemplate.name}
				error={storeApp.errorName}
				onChange={({ target }) => {
					storeApp.setErrorName(false)
					storeTemplate.setTemplateName(target.value)
				}}
			/>
			<Button variant='filled' color='green' onClick={() => serviceTemplate.handleSave()}>
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
			<Button variant='outline' onClick={() => storeApp?.setLoadTemplateFlag(true)}>
				Шаблоны
			</Button>
			<Button
				variant='outline'
				color={storeApp.previewFlag ? 'lime' : ''}
				onClick={() => storeApp?.setPreviewFlag?.(!storeApp.previewFlag)}
			>
				Предпросмотр
			</Button>
		</Group>
	)
})

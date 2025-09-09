import { Button, Group, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceTemplate } from '../../services/template/service'

export const HeaderMain = observer(() => {
	const { importFlag, previewFlag, errorName } = storeApp

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
					storeApp.setErrorName(false)
					storeTemplate.setTemplateName(target.value)
				}}
			/>
			<Button
				variant='filled'
				color='green'
				onClick={serviceTemplate.handleSave}
			>
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
			<Button
				variant='outline'
				onClick={() => storeApp?.setLoadTemplateFlag(true)}
			>
				Шаблоны
			</Button>
			<Button
				variant='outline'
				color={importFlag ? 'lime' : ''}
				onClick={() => storeApp?.setImportFlag(!importFlag)}
			>
				Импорт кода
			</Button>
			<Button
				variant='outline'
				color={previewFlag ? 'lime' : ''}
				onClick={() => storeApp?.setPreviewFlag?.(!previewFlag)}
			>
				Предпросмотр
			</Button>
		</Group>
	)
})

import { Button, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { serviceTemplate } from '../../services/template/service'
import { Header } from '../../shared/ui'

export const HeaderMain = observer(() => {
	const history = useHistory()
	const newTemplate = async () => {
		storeTemplate.clear()
		history.clear()
		await serviceTemplate.newName()
		storeTemplate.setTemplateName(await serviceTemplate.newName())
		storeApp.setErrorName(false)
	}
	return (
		<Header>
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
					history.append(storeTemplate.objects, 'Очистка')
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
		</Header>
	)
})

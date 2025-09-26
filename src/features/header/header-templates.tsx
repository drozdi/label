import { Button, FileButton } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceNotifications } from '../../services/notifications/service'
import { Header } from '../../shared/ui'

export const HeaderTemplates = observer(() => {
	const handleImport = file => {
		if (!file.name.match(/\.tdmc$/gm)) {
			serviceNotifications.error(
				'Необходимо загрузить файл типа .tdmc (Template DMC). Экспортированный ранее из редактора этикеток DMC или DMC'
			)
			return
		}
		storeTemplates.importTemplate(file)
	}

	return (
		<Header>
			<Button variant='outline' onClick={() => storeApp?.setLoadTemplateFlag(false)}>
				Закрыть
			</Button>
			<FileButton onChange={handleImport} accept='.tdmc'>
				{props => (
					<Button {...props} variant='outline'>
						Импорт
					</Button>
				)}
			</FileButton>
		</Header>
	)
})

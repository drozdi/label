import { Button, FileButton, Group } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplates } from '../../entites/templates/store'
import { serviceNotifications } from '../../services/notifications/service'
import { useAppContext } from '../context'

export const HeaderTemplates = observer(() => {
	const ctx = useAppContext()

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
		<Group gap='xs'>
			<Button variant='outline' onClick={() => ctx?.setLoadTemplateFlag(false)}>
				Закрыть
			</Button>
			<FileButton onChange={handleImport} accept='.tdmc'>
				{props => (
					<Button {...props} variant='outline'>
						Импорт
					</Button>
				)}
			</FileButton>
		</Group>
	)
})

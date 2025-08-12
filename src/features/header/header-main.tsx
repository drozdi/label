import { Button, Group } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'

export const HeaderMain = observer(() => {
	const ctx = useAppContext()
	return (
		<Group gap='sm' p='sm'>
			<Button variant='outline' onClick={() => storeTemplate.clear()}>
				Создать
			</Button>
			<Button variant='outline'>Сохранить</Button>
			<Button variant='outline' onClick={() => ctx?.setLoadTemplateFlag(true)}>
				Шаблоны
			</Button>
		</Group>
	)
})

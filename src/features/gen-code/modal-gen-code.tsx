import { Modal } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { GenCode } from './gen-code'

export const ModalGenCode = observer(props => {
	return (
		<Modal
			title='Генерация кода печати'
			size='xl'
			opened={storeApp.genCodeFlag}
			onClose={() => storeApp.setGenCodeFlag(false)}
		>
			<GenCode />
		</Modal>
	)
})

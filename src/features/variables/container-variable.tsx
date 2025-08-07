import { CloseButton, Group, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useAppContext } from '../context'
import { ListVariable } from './list-variable'

export const ContainerVariable = observer(() => {
	const ctx = useAppContext()
	const handleClose = () => {
		ctx?.setVariableFlag(false)
	}
	return (
		<Stack>
			<Group justify='space-between'>
				Переменные
				<CloseButton onClick={handleClose} />
			</Group>
			<ListVariable />
		</Stack>
	)
})

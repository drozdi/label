import { Dialog } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'

export const AutoSave = observer(() => {
	const [opened, toggle] = useDisclosure(false)
	return <Dialog opened={opened}></Dialog>
})

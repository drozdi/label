import { Dialog, Group } from '@mantine/core'
import { useDisclosure, useTimeout } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { TbCheck } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { serviceTemplate } from '../../services/template/service'

export const AutoSave = observer(() => {
	const [opened, { open, close }] = useDisclosure(false)
	const autoClose = useTimeout(() => {
		close()
	}, 2000)

	const autoSave = useTimeout(
		async () => {
			if (storeTemplate.id) {
				await storeApp.silent(async () => {
					await serviceTemplate.handleSave()
				})
				open()
				autoSave.start()
				autoClose.start()
			}
		},
		storeApp.timeAutoSave * 1000,
		{
			autoInvoke: false,
		}
	)

	useEffect(() => {
		if (storeApp.timeAutoSave && storeTemplate.id) {
			autoSave.start()
		} else {
			close()
		}
		return () => {
			autoSave.clear()
			close()
		}
	}, [storeApp.timeAutoSave, storeTemplate.id])

	return (
		<Dialog opened={opened} w={200} onClose={() => close()} withCloseButton>
			<Group c='green' ta='center'>
				<TbCheck />
				Сохранено
			</Group>
		</Dialog>
	)
})

import { Button, FileButton, Group, Modal, SegmentedControl, Stack, Textarea, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { serviceNotifications } from '../../services/notifications/service'
import { ezplParser } from './utils/ezpl-parser'
import { jsonParaser } from './utils/json-parser'
import { tsplParser } from './utils/tspl-parser'
import { zplParser } from './utils/zpl-parser'

export const Import = observer(() => {
	const [dpi, setDpi] = useState('12')

	const refText = useRef<HTMLTextAreaElement>(null)
	const handleFile = (file: any) => {
		if (!file.name.toLowerCase().match(/\.txt$/g)) {
			serviceNotifications.error('Необходимо загрузить файл с разрешением txt')
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			refText.current.value = reader.result
		}
		reader.readAsText(file)
	}

	const handleParse = () => {
		if (refText.current.value < 10) {
			return
		}
		storeTemplate.clear()
		try {
			if (jsonParaser.test(refText.current.value)) {
				jsonParaser.parse(refText.current.value, Number(dpi))
			} else if (zplParser.test(refText.current.value)) {
				zplParser.parse(refText.current.value, (Number(dpi) * 25) / 25.4)
			} else if (ezplParser.test(refText.current.value)) {
				ezplParser.parse(refText.current.value, Number(dpi))
			} else if (tsplParser.test(refText.current.value)) {
				tsplParser.parse(refText.current.value, Number(dpi))
			}
			storeTemplate.loadObjects([...storeTemplate.objects])
			storeApp.setImportFlag(false)
		} catch (e) {
			console.error(e)
			serviceNotifications.error(e.message)
		}
	}

	return (
		<Modal
			opened={storeApp.importFlag}
			onClose={() => storeApp.setImportFlag(false)}
			title='Импорт кода по строкам'
			size='xl'
		>
			<Stack gap='sm'>
				<SegmentedControl
					value={dpi}
					onChange={setDpi}
					data={[
						{ value: '12', label: '300' },
						{ value: '8', label: '200' },
					]}
				/>
				<Title order={6}>
					{/* <div>Необработанные ключи: {unprocessedKey.join(' ')}</div>
					<div>Необработанное тело: {unprocessedBody.join(' ')}</div> */}
				</Title>
				<Textarea rows={20} ref={refText} />

				<Group gap='sm'>
					<Button variant='filled' onClick={handleParse}>
						Импорт
					</Button>
					<Button variant='filled' onClick={() => storeApp.setImportFlag(false)}>
						Закрыть
					</Button>
					<FileButton onChange={handleFile} accept='.txt'>
						{props => (
							<Button {...props} variant='filled'>
								Загрузить из файла (.txt)
							</Button>
						)}
					</FileButton>
				</Group>
			</Stack>
		</Modal>
	)
})

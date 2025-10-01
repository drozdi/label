import { useState } from 'react'
import { storeFonts } from '../../../entites/fonts/store'
import { serviceNotifications } from '../../../services/notifications/service'

export function useFontsUpload() {
	const [file, setFile] = useState<any>(null)
	const [name, setName] = useState('')

	const upload = file => {
		const name = file.name
		if (!name.toLowerCase().match(/\.ttf$/g)) {
			serviceNotifications.error('Необходимо загрузить файл с разрешением ttf')
			return
		}
		setName(name.replace(/(\.)|(...$)/g, ''))
		setFile(file)
	}
	const writeName = value => setName(value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, ''))

	const save = () => {
		const reader = new FileReader()
		reader.onload = async () => {
			try {
				await storeFonts.add(name, reader.result.replace(/data:application\/.*;base64,/g, ''))
				setFile(null)
				setName('')
			} catch (e) {
				serviceNotifications.error(e)
			}
		}
		reader.readAsDataURL(file)
	}
	const cancel = () => setFile(null)

	return { file, name, writeName, upload, save, cancel }
}

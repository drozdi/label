import { useState } from 'react'
import { storeImages } from '../../../entites/images/store'
import { serviceNotifications } from '../../../services/notifications/service'

export function useImagesUpload() {
	const [file, setFile] = useState<any>(null)
	const [image, setImage] = useState<any>(null)
	const [name, setName] = useState('')

	const upload = (file: any) => {
		const name = file.name

		if (file.type !== 'image/bmp') {
			serviceNotifications.error(
				`Вы пытаетесь добавить файл ${file.type}. Вы можете загрузить только изображение с форматом .bmp`
			)
			return
		}
		if (file.size > 512000) {
			serviceNotifications.error('Превышен максимальный размер файла. Максимальный разрешённый размер 515 Кб')
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			setImage(reader.result.replace(/data:image\/bmp;base64,/g, ''))
		}
		reader.readAsDataURL(file)

		setName(name.replace(/(\.)|(...$)/g, ''))
		setFile(file)
	}
	const save = async () => {
		try {
			await storeImages.add(name, image)
			setImage(null)
			setFile(null)
			setName('')
		} catch (e) {
			serviceNotifications.error(e)
		}
	}
	const cancel = () => {
		setFile(null)
	}
	const writeName = value => {
		setName(value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, ''))
	}

	return { file, image, name, upload, save, cancel, writeName }
}

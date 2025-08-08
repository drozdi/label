import { api } from '../../shared/api'
import { genName } from '../../shared/utils'

// Получить все изображения
export async function requestIimagesList() {
	const res = await api.get(`/images/`)
	return res.data
}

//   Загрузить изображение на сервер
export async function requestIimagesAdd(name, file) {
	try {
		const res = await api.post(`images/`, {
			name: name,
			tag_images: genName(name) + '.BMP',
			data: file,
		})
	} catch (e) {
		console.error(e)
	} finally {
		this.getImages()
	}
}

import { api } from '../../shared/api'

// Получить все изображения
export async function requestFontsList() {
	const res = await api.get(`/fonts/`)
	return res.data
}

//   Загрузить шрифт
export async function requestFontsAdd(name, file) {
	const res = await api.post(`/fonts/`, {
		name: String(name),
		tag_fonts: String(name) + '.TTF',
		data: file,
	})
	return res.data
}

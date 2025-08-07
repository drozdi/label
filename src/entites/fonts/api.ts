import { api } from '../../shared/api'

export async function requestFontsList() {
	const res = await api.get(`/fonts/`)
	return res.data
}

export async function requestFontsAdd(name, file) {
	const res = await request.post(`/fonts/`, {
		name: String(name),
		tag_fonts: api(String(name)) + '.TTF',
		data: file,
	})
	return res.data
}

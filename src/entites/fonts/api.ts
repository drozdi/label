import { api } from '../../shared/api'

export async function requestFontsList() {
	const res = await api.get(`/fonts/`)
	return res.data
}

export async function requestFontsGet(id_fonts: number) {
	const res = await api.post(`/fonts/${id_fonts}`)
	return res.data.data
}

export async function requestFontsAdd(name: string, data: string) {
	const res = await api.post(`/fonts/`, {
		name: String(name),
		tag_fonts: String(name) + '.TTF',
		data: data,
	})
	return res.data
}

export async function requestFontsUpdate(id_fonts: number, data: IFont) {
	const res = await api.post(`/fonts/${id_fonts}`, data)
	return res.data
}

export async function requestFontsDelete(id_fonts: number | number[]) {
	const res = await api.post(`/fonts/`, {
		id_fonts: [].concat(id_fonts),
	})
	return res.data
}

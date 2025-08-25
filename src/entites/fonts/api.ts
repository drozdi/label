import { api } from '../../shared/api'

export async function requestFontsList({
	size = 100,
	number = 0,
}: IRequestFont = {}): Promise<{
	success: boolean
	data: IResponseFontList
}> {
	const res = await api.get(`/fonts/`, {
		params: {
			size,
			number,
		},
	})
	return res.data
}

export async function requestFontsGet(id_fonts: number): Promise<IFont> {
	const res = await api.get(`/fonts/${id_fonts}`)
	return res.data.data
}

export async function requestFontsAdd(
	name: string,
	data: string
): Promise<{
	success: boolean
	data: IFont
}> {
	const res = await api.post(`/fonts/`, {
		name: String(name),
		tag_fonts: String(name) + '.TTF',
		data: data,
	})
	return res.data
}

export async function requestFontsUpdate(
	id_fonts: number,
	data: IFont
): Promise<{
	success: boolean
	data: IFont
}> {
	const res = await api.patch(`/fonts/${id_fonts}`, data)
	return res.data
}

export async function requestFontsDelete(id_fonts: number | number[]): Promise<{
	success: true
	data: string
}> {
	const res = await api.delete(`/fonts/`, {
		data: {
			id_fonts: [].concat(id_fonts as never),
		},
	})
	return res.data
}

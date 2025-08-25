import { api } from '../../shared/api'

// Получить все изображения
export async function requestIimagesList({
	size = 100,
	number = 0,
}: IRequestImage = {}): Promise<{
	success: boolean
	data: IResponseImageList
}> {
	const res = await api.get(`/images/`, {
		params: {
			size,
			number,
		},
	})
	return res.data
}

export async function requestImagesGet(id_images: number): Promise<IImage> {
	const res = await api.get(`/images/${id_images}`)
	return res.data.data
}

export async function requestImagesAdd(
	name: string,
	data: string
): Promise<{
	success: boolean
	data: IImage
}> {
	const res = await api.post(`/images/`, {
		name: String(name),
		tag_images: String(name) + '.BMP',
		data: data,
	})
	return res.data
}

export async function requestImagesUpdate(
	id_images: number,
	data: IImage
): Promise<{
	success: boolean
	data: IImage
}> {
	const res = await api.patch(`/images/${id_images}`, data)
	return res.data
}

export async function requestImagesDelete(
	id_images: number | number[]
): Promise<{
	success: true
	data: string
}> {
	const res = await api.delete(`/images/`, {
		data: {
			id_images: [].concat(id_images as never),
		},
	})
	return res.data
}

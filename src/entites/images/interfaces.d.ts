interface IImage {
	id?: number
	name: string
	tag_images: string
	data: string
}

interface IRequestImage {
	size?: number
	number?: number
}

interface IResponseImageList {
	page: number
	next_page: number
	previous_page: number
	size: number
	total_records: number
	response: IImage[]
}

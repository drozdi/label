interface IFont {
	id?: number
	name: string
	tag_fonts: string
	data: string
}

interface IRequestFont {
	size?: number
	number?: number
}

interface IResponseFontList {
	page: number
	next_page: number
	previous_page: number
	size: number
	total_records: number
	response: IFont[]
}

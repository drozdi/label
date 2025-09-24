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

interface IStoreFonts {
	isLoading: boolean
	isLoaded: boolean
	error: string
	_list: IFont[]
	id: number
	list: IFont[]
	default: IFont | undefined
	load(reloading: boolean): Promise<void>
	add(name: string, data: string): Promise<void>
	remove(id: number): Promise<void>
	setId(id: number): void
	findById(id: number): IFont | undefined
	findByName(name: string): IFont | undefined
	findByTagFonts(tagFonts: string): IFont | undefined
}

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

interface IStoreImages {
	isLoading: boolean
	isLoaded: boolean
	error: string
	_list: IImage[]
	id: number
	list: IImage[]
	default: IImage | undefined
	load(reloading = false): Promise<void>
	add(name: string, data: string): Promise<void>
	remove(id: number): Promise<void>
	setId(id: number): void
	findById(id: number): IImage | undefined
	findByName(name: string): IImage | undefined
	findByTagImages(tagImages: string): IImage | undefined
}

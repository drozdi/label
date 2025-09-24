interface ITemplate {
	name: string
	width_mm: number
	height_mm: number
	gap_mm: number
	reference_x: number
	reference_y: number
	direction_x: number
	direction_y: number
	id?: number
}

interface IRequestTemplateList {
	size: number
	number: number
}

interface IResponseTemplateList {
	success: boolean
	data: {
		page: number
		next_page: number
		previous_page: number
		size: number
		total_records: number
		response: ITemplate[]
	}
}

interface IStoreTemplates {
	isLoaded: boolean
	isLoading: boolean
	_list: ITemplate[]
	error: string
	selected: ITemplate | null
	list: ITemplate[]
	load(reloading: boolean = false): Promise<void>
	clear(): Promise<void>
	selectTemplate(id: number | string): Promise<void>
	deleteTemplate(id: number | string): Promise<void>
	newTemplate(template): Promise<void>
	updateTemplate(template): Promise<ITemplate>
	exportTemplate(): Promise<void>
	importTemplate(file): Promise<void>
}

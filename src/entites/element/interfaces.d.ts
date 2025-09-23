type IObjectProp =
	| 'name'
	| 'text_align'
	| 'human_readable'
	| 'radius'
	| 'line_thickness'
	| 'enabled'
	| 'type'
	| 'pos_x'
	| 'pos_y'
	| 'width'
	| 'height'
	| 'rotation'
	| 'code_type'
	| 'font_size'
	| 'font_id'
	| 'image_id'
	| 'data'

type IObjectPropResize = 'e' | 's' | 'sw'

type IObjectSize = {
	top: number
	left: number
	width: number
	height: number
	right: number
	bottom: number
}

interface IObject {
	/////
	name: null | string
	text_align: number
	human_readable: number
	radius: number
	line_thickness: number
	enabled: boolean
	type: string | null
	pos_x: number
	pos_y: number
	width: number
	height: number
	rotation: number
	code_type: string | null
	font_size: number
	font_id: number
	image_id: number
	data: string | null
	template_id?: number | null
	id?: number | null
	font_rel?: IFont | null
	image_rel?: Image | null

	/////
	mm?: number
	cm?: number
	mm_qr?: number
	temp?: boolean

	properties: Array<IObjectProp>

	multiProperties: IObjectProp[]
	fontFamily?: IFont.name
	imageName?: IImage.name
	imageData?: IImage.data
	resize: IObjectPropResize[]
	getCorrectProps(): IObject
	getProps(): IObject
	copy(): IObject
	size(scale: number): IObjectSize
	style(scale: number): StyleSheet
	render(scale: number, preview: boolean): React.ReactNode

	setName(name: string): void
	setWidth(width: string | number): void
	setHeight(height: string | number): void
	setPosX(pos_x: string | number): void
	setPosY(pos_y: string | number): void
	setRotation(rotation: string | number): void
	setTextAlign(value: string | number): void
	setFontSize(value: string | number): void
	setLineThickness(value: string | number): void
	setRadius(value: string | number): void
	setEnabled(value: boolean): void
	setFontId(value: string | number): void
	setData(value: string): void
	setHumanReadable(value: string | number): void
	setImageId(value: string | number): void
}

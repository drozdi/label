import { CM, MM, MM_QR } from '../../shared/constants'
import { round } from '../../shared/utils'
import { storeFonts } from '../fonts/store'
import { storeImages } from '../images/store'
import { factoryElement } from './factory-element'

export class BaseElement implements IObject {
	/////
	mm = MM
	cm = CM
	mm_qr = MM_QR
	temp = false
	/////
	name: null | string = null
	text_align = 1
	human_readable = 0
	radius = 0
	line_thickness = 0.0
	enabled = true
	type: string | null = null
	pos_x = 0.0
	pos_y = 0.0
	width = 0.0
	height = 0.0
	rotation = 0.0
	code_type: string | null = null
	font_size = 12
	font_id = 0
	image_id = 0
	data: string | null = null
	template_id = null
	id = null
	font_rel = null
	image_rel = null

	constructor(object: Record<string, any>) {
		for (const prop in object) {
			if (object[prop] !== undefined) {
				this[prop] = object[prop]
			}
		} //*/
		/*this.name = object.name
		this.text_align = object.text_align
		this.human_readable = object.human_readable
		this.radius = object.radius
		this.line_thickness = object.line_thickness
		this.enabled = object.enabled
		this.type = object.type
		this.pos_x = object.pos_x
		this.pos_y = object.pos_y
		this.width = object.width
		this.height = object.height
		this.rotation = object.rotation
		this.code_type = object.code_type
		this.font_size = object.font_size
		this.font_id = object.font_id
		this.image_id = object.image_id
		this.data = object.data
		this.font_rel = object.font_rel
		this.image_rel = object.image_rel //*/
	}
	get properties() {
		return ['enabled', 'name', 'pos_x', 'pos_y', 'width', 'height']
		return [
			'name',
			'text_align',
			'human_readable',
			'radius',
			'line_thickness',
			'enabled',
			'type',
			'pos_x',
			'pos_y',
			'width',
			'height',
			'rotation',
			'code_type',
			'font_size',
			'font_id',
			'image_id',
			'data',
		]
	}
	get multiProperties() {
		return ['enabled']
	}
	get fontFamily() {
		return (storeFonts.findById(this.font_id) || this.font_rel)?.name
	}
	get imageName() {
		return (storeImages.findById(this.image_id) || this.image_rel)?.name
	}
	get imageData() {
		return (storeImages.findById(this.image_id) || this.image_rel)?.data
	}
	get resize(): number[] {
		return []
	}
	getCorrectProps() {
		return this
	}
	getProps() {
		return {
			...this.getCorrectProps(),
			id: parseInt(this.id) > 0 ? this.id : undefined,
			font_id: parseInt(this.font_id) > 0 ? this.font_id : undefined,
			image_id: parseInt(this.image_id) > 0 ? this.image_id : undefined,
			mm: undefined,
			cm: undefined,
			mm_qr: undefined,
			font_rel: undefined,
			image_rel: undefined,
			temp: undefined,
		}
	}
	copy() {
		return factoryElement(this)
	}
	size(scale = 1) {
		const element = document.getElementById(this.id)
		const rectElement = element?.getBoundingClientRect()
		const rectParent = element?.parentElement?.getBoundingClientRect()
		return {
			top: round((rectElement?.top - rectParent?.top) / this.mm / scale),
			left: round((rectElement?.left - rectParent?.left) / this.mm / scale),
			width: round(rectElement?.width / this.mm / scale),
			height: round(rectElement?.height / this.mm / scale),
			right: round((rectParent?.width - (rectElement?.left - rectParent?.left) - rectElement?.width) / this.mm / scale),
			bottom: round(
				(rectParent?.height - (rectElement?.top - rectParent?.top) - rectElement?.height) / this.mm / scale
			),
		}
	}
	style(scale = 1) {
		const element = document.getElementById(this.id)
		let width, height, _width, _height
		let left = this.pos_x * this.mm * scale
		let top = this.pos_y * this.mm * scale

		if (this.width === 'fit-content') {
			_width = element?.getBoundingClientRect()?.width
			width = 'auto'
		} else {
			width = this.width * this.mm * scale
		}
		if (this.height === 'fit-content') {
			_height = element?.getBoundingClientRect()?.height
			height = 'auto'
		} else {
			height = this.height * this.mm * scale
		}

		return {
			left: round(left),
			top: round(top),
			width: width === 'auto' ? 'auto' : round(width),
			height: height === 'auto' ? 'auto' : round(height),
			fontSize: this.font_size * scale + 'pt',
			justifyContent: this.text_align === 2 ? 'center' : this.text_align === 3 ? 'flex-end' : 'flex-start',
			rotate: this.rotation + 'deg',
			opacity: this.enabled ? '' : 0.2,
			borderRadius: this.radius,
			fontFamily: this.fontFamily,
			transformOrigin: 'top left',
		}
	}

	render(scale = 1, preview = false): React.ReactNode {
		return typeof this.data === 'string' ? this.data.replace(/  /g, ' \u00A0') : this.data
	}

	setName(name: string) {
		this.name = name
	}
	setWidth(width: string | number) {
		if (typeof width === 'string') {
			width = parseInt(width, 10)
		}
		this.width = round(width)
	}
	setHeight(height: string | number) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		this.height = round(height)
	}
	setPosX(pos_x: string | number) {
		if (typeof pos_x === 'string') {
			pos_x = parseInt(pos_x, 10)
		}
		this.pos_x = round(pos_x)
	}
	setPosY(pos_y: string | number) {
		if (typeof pos_y === 'string') {
			pos_y = parseInt(pos_y, 10)
		}
		this.pos_y = round(pos_y)
	}
	setRotation(rotation: string | number) {
		if (typeof rotation === 'string') {
			rotation = parseInt(rotation, 10)
		}
		this.rotation = rotation
	}
	setTextAlign(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.text_align = value
	}
	setFontSize(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.font_size = value
	}
	setLineThickness(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.line_thickness = round(value)
	}
	setRadius(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.radius = value
	}
	setEnabled(value: boolean) {
		this.enabled = value
	}
	setTemp(temp: boolean) {
		this.temp = temp
	}

	setFontId(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.font_id = value
	}
	setData(value: string) {
		this.data = value
	}
	setHumanReadable(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.human_readable = value
	}
	setImageId(value: string | number) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.image_id = value
	}
}

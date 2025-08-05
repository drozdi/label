import { factoryElement } from './factory-element'
export class BaseElement {
	name: null | string = null
	text_align = null
	human_readable = 0
	radius = null
	line_thickness = null
	enabled = true
	type = null
	pos_x = 0.0
	pos_y = 0.0
	width = 0.0
	height = 0.0
	rotation = 0.0
	code_type = null
	font_size = null
	font_id = null
	image_id = null
	data = null
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
	copy() {
		return factoryElement(this)
	}
	get properties() {
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
			'font_rel',
			'image_rel',
		]
	}
	get style() {
		return {}
	}
	setName(name: string) {
		this.name = name
	}
	setWidth(width: string | number) {
		if (typeof width === 'string') {
			width = parseInt(width, 10)
		}
		this.width = width
	}
	setHeight(height: string | number) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		this.height = height
	}
	setPosX(pos_x: string | number) {
		if (typeof pos_x === 'string') {
			pos_x = parseInt(pos_x, 10)
		}
		this.pos_x = pos_x
	}
	setPosY(pos_y: string | number) {
		if (typeof pos_y === 'string') {
			pos_y = parseInt(pos_y, 10)
		}
		this.pos_y = pos_y
	}
	setRotation(rotation: string | number) {
		if (typeof rotation === 'string') {
			rotation = parseInt(rotation, 10)
		}
		this.rotation = rotation
	}
}

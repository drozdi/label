import { makeAutoObservable } from 'mobx'
import { CM, DEF_TEMPLATE, MM, MM_QR } from '../../shared/constants'
import { round } from '../../shared/utils'
import { factoryElement } from '../element/factory-element'

class StoreTemplate {
	dpi = 12
	// размеры этикетки
	width_mm = 58
	height_mm = 58
	radius_label = 5
	gap_mm = 2
	direction_x = 1
	direction_y = 0
	reference_x = 0
	reference_y = 0
	objects = []
	scale = 1
	id = 0
	name = ''

	/////
	mm = MM
	cm = CM
	mm_qr = MM_QR

	////
	currId: number | string = 0
	currIndex = -1

	selected: Array<number | string> = []

	selectObject(id: number | string) {
		id = String(id)
		if (this.selected.includes(id)) {
			this.selected = this.selected.filter(item => item !== id)
		} else {
			this.selected.push(id)
		}
		if (this.selected.length === 1) {
			this.currId = this.selected[0]
			this.currIndex = this.objects.findIndex(
				object => String(object.id) === String(this.currId)
			)
		} else {
			this.currId = 0
			this.currIndex = -1
		}
	}

	constructor() {
		makeAutoObservable(this)
	}

	get width() {
		return this.width_mm * this.mm * this.scale
	}
	get height() {
		return this.height_mm * this.mm * this.scale
	}
	get borderRadius() {
		return this.radius_label
	}
	get referenceX() {
		return this.reference_x * this.mm * this.scale
	}
	get referenceY() {
		return this.reference_y * this.mm * this.scale
	}
	get space() {
		return this.gap_mm * this.mm * this.scale
	}
	get style() {
		return {
			width: this.width,
			height: this.height,
			borderRadius: this.borderRadius,
		}
	}
	get current() {
		return this.objects[this.currIndex] || undefined
	}

	get selectedIndex() {
		return this.selected.map(id =>
			this.objects.findIndex(object => String(object.id) === String(id))
		)
	}
	getCurrent() {
		return this.objects[this.currIndex] || undefined
	}
	setActiveObject(id: number | string) {
		this.currId = id
		this.currIndex = this.objects.findIndex(
			object => String(object.id) === String(this.currId)
		)
		if (this.currIndex === -1) {
			this.currId = 0
		}
		if (this.currId) {
			this.selected = [this.currId]
		} else {
			this.selected = []
		}
	}
	deleteObject(id: number | string) {
		this.objects = this.objects.filter(object => {
			return String(object.id) !== String(id)
		})
		if (this.selected.includes(id)) {
			this.selected = this.selected.filter(item => item !== id)
		}
		this.setActiveObject(this.currId)
	}
	deleteCurrentObject() {
		this.deleteObject(this.currId)
	}
	loadObjects(objects: Array<any> = []) {
		this.objects = []
		objects.forEach(element => {
			this.addObject(element)
		})
	}
	addObject(object) {
		this.objects.push(factoryElement(object) as never)
	}
	private _loadTemplate(template) {
		this.width_mm = template.width_mm
		this.height_mm = template.height_mm
		this.radius_label = template.radius_label ?? this.radius_label
		this.gap_mm = template.gap_mm
		this.direction_x = template.direction_x
		this.direction_y = template.direction_y
		this.reference_x = template.reference_x
		this.reference_y = template.reference_y
		this.loadObjects(template.objects || [])
	}
	clear(all: boolean = true) {
		this._loadTemplate(DEF_TEMPLATE)
		if (all) {
			this.id = 0
			this.name = ''
		}
	}
	loadTemplate(template, copy: boolean = false) {
		if (template) {
			this._loadTemplate(template)
			if (copy) {
				this.id = 0
				this.name = ''
			} else {
				this.id = template.id
				this.name = template.name
			}
		}
	}
	setTemplateName(name: string) {
		this.name = name
	}
	setScale(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.scale = value
		this.objects = this.objects.map(object => object.copy())
	}
	changeDpi(dpi: null | string) {
		let newDpi: null | string | number = dpi || '12'
		if (typeof newDpi === 'string') {
			newDpi = parseInt(newDpi, 10)
		}
		this.dpi = newDpi
	}
	changeWidth(width: number | string) {
		if (typeof width === 'string') {
			width = parseInt(width, 10)
		}
		this.width_mm = width
	}
	changeHeight(height: number | string) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		this.height_mm = height
	}
	changeRadius(radius: number | string) {
		if (typeof radius === 'string') {
			radius = parseInt(radius, 10)
		}
		this.radius_label = radius
	}
	changeGap(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.gap_mm = value
	}
	changeRefX(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.reference_x = value
	}
	changeRefY(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.reference_y = value
	}
	changeDirection1(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.direction_x = value
	}
	changeDirection2(value: number | string) {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.direction_y = value
	}
	toggleEnabled(id: number) {
		const index = this.objects.findIndex(object => object.id === id)
		if (index > -1) {
			this.objects[index].enabled = !this.objects[index].enabled
			this.objects[index] = this.objects[index].copy()
		}
	}

	setCurrent(object) {
		if (!object || !this.objects[this.currIndex]) {
			return
		}
		this.objects[this.currIndex] = object.copy()
	}
	setName(name: string) {
		this.current?.setName(name)
		this.setCurrent(this.current)
	}
	setWidth(width: string | number) {
		this.current?.setWidth(width)
		this.setCurrent(this.current)
	}
	setHeight(height: string | number) {
		this.current?.setHeight(height)
		this.setCurrent(this.current)
	}
	setPosX(pos_x: string | number) {
		this.current?.setPosX(pos_x)
		this.setCurrent(this.current)
	}
	setPosY(pos_y: string | number) {
		this.current?.setPosY(pos_y)
		this.setCurrent(this.current)
	}
	setRotation(rotation: string | number) {
		this.current?.setRotation(rotation)
		this.setCurrent(this.current)
	}
	setTextAlign(value: string | number) {
		this.current?.setTextAlign(value)
		this.setCurrent(this.current)
	}
	setFontSize(value: string | number) {
		this.current?.setFontSize(value)
		this.setCurrent(this.current)
	}
	setLineThickness(value: string | number) {
		this.current?.setLineThickness(value)
		this.setCurrent(this.current)
	}
	setRadius(value: string | number) {
		this.current?.setRadius(value)
		this.setCurrent(this.current)
	}
	setEnabled(value: boolean) {
		this.current?.setEnabled(value)
		this.setCurrent(this.current)
	}
	setFontId(value: string | number) {
		this.current?.setFontId(value)
		this.setCurrent(this.current)
	}
	setData(value: string) {
		this.current?.setData(value)
		this.setCurrent(this.current)
	}
	setHumanReadable(rotation: string | number) {
		this.current?.setHumanReadable(rotation)
		this.setCurrent(this.current)
	}
	setImageId(value: string | number) {
		this.current?.setImageId(value)
		this.setCurrent(this.current)
	}

	isOne() {
		return this.selected.length === 1
	}
	isEmpty() {
		return this.selected.length === 0
	}
	isSelected(id: number) {
		return this.selected.includes(id)
	}
	deleteSelectedObject() {
		;[...this.selected].forEach(id => {
			this.deleteObject(id)
		})
	}
	moveX(value: number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosX(round(this.objects[index].pos_x + value))
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	moveY(value: number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosY(round(this.objects[index].pos_y + value))
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
}

export const storeTemplate = new StoreTemplate()

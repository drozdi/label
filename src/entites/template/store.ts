import { makeAutoObservable } from 'mobx'
import { CM, DEF_TEMPLATE, KEY_SCALE_DEFAULT, MM, MM_QR } from '../../shared/constants'
import { round, roundInt } from '../../shared/utils'
import { factoryElement } from '../element/factory-element'

class StoreTemplate {
	dpi = 12
	// размеры этикетки
	width_mm = 58
	height_mm = 58
	indent_mm = 3
	radius_label = 5
	gap_mm = 2
	direction_x = 1
	direction_y = 0
	reference_x = 0
	reference_y = 0
	objects: IObject[] = []
	scale = Number(localStorage.getItem(KEY_SCALE_DEFAULT) || 1)
	id = 0
	name = ''

	num = 5

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
			this.selected = this.selected.filter(item => String(item) !== id)
		} else {
			this.selected = [...this.selected, id]
		}
		if (this.selected.length === 1) {
			this.currId = this.selected[0]
			this.currIndex = this.objects.findIndex(object => String(object.id) === String(this.currId))
		} else {
			this.currId = 0
			this.currIndex = -1
		}
	}

	constructor() {
		makeAutoObservable(this)
	}

	get width() {
		return roundInt(this.width_mm * this.mm * this.scale)
	}
	get height() {
		return roundInt(this.height_mm * this.mm * this.scale)
	}
	get indent() {
		return roundInt(this.indent_mm * this.mm * this.scale)
	}
	get borderRadius() {
		return this.radius_label
	}
	get referenceX() {
		return roundInt(this.reference_x * this.mm * this.scale)
	}
	get referenceY() {
		return roundInt(this.reference_y * this.mm * this.scale)
	}
	get space() {
		return roundInt(this.gap_mm * this.mm * this.scale)
	}
	get style() {
		return {
			width: this.width,
			height: this.height,
			borderRadius: this.borderRadius,
		}
	}
	get current() {
		return this.objects[this.currIndex] || this.selectedObjects?.[0] || undefined
	}

	get selectedIndex() {
		return this.selected.map(id => this.objects.findIndex(object => String(object.id) === String(id)))
	}
	get selectedObjects() {
		return this.selected.map(id => this.findById(id))
	}
	get inverseIds() {
		return [...new Set(this.objects.map(o => String(o.id))).difference(new Set(this.selected))]
	}
	get inverseIndex() {
		return this.inverseIds.map(id => this.objects.findIndex(object => String(object.id) === String(id)))
	}
	get inverseObjects() {
		return this.inverseIds.map(id => this.findById(id))
	}

	get divisionsX() {
		const step = (this.width - this.indent * 2) / (this.num + 1)
		return new Array(this.num + 2).fill(0).map((item, index) => {
			return this.indent + step * index
		})
	}
	get divisionsY() {
		const step = (this.height - this.indent * 2) / (this.num + 1)
		return new Array(this.num + 2).fill(0).map((item, index) => {
			return this.indent + step * index
		})
	}

	setNum(num: number) {
		this.num = num
	}

	setActiveObject(id: number | string) {
		this.currId = String(id)
		this.currIndex = this.objects.findIndex(object => String(object.id) === this.currId)
		if (this.currIndex === -1) {
			this.currId = 0
		}
		if (this.currId) {
			this.selected = [this.currId]
		} else {
			this.selected = []
		}
	}
	findById(id: number | string) {
		return this.objects.find(object => {
			return String(object.id) === String(id)
		})
	}
	setById(id: number | string, object: Record<string, any>) {
		this.objects = this.objects.map(o => {
			if (String(o.id) === String(id)) {
				return factoryElement(object)
			}
			return o
		})
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
	loadObjects(objects: any[] = []) {
		while (this.objects.length) {
			this.objects.pop()
		}
		this.objects = []
		objects.forEach(object => {
			this.objects.push(factoryElement(object) as never)
		})
	}
	addObject(object: Record<string, any>) {
		this.objects.push(factoryElement(object))
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
		localStorage.setItem(KEY_SCALE_DEFAULT, String(value))
		this.loadObjects(this.objects.map(object => object.copy()))
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
	changeIndent(indent: number | string) {
		if (typeof indent === 'string') {
			indent = parseInt(indent, 10)
		}
		this.indent_mm = indent
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

	setName(name: string) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setName(name)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setWidth(width: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setWidth(width)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setHeight(height: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setHeight(height)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setPosX(pos_x: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosX(pos_x)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setPosY(pos_y: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosY(pos_y)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setRotation(rotation: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setRotation(rotation)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setTextAlign(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setTextAlign(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setFontSize(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setFontSize(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setLineThickness(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setLineThickness(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setRadius(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setRadius(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setEnabled(value: boolean) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setEnabled(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setTemp(value: boolean) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setTemp(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setData(value: string) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setData(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setHumanReadable(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setHumanReadable(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setFontId(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setFontId(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	setImageId(value: string | number) {
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setImageId(value)
				this.objects[index] = this.objects[index].copy()
			}
		})
	}

	isOne() {
		return this.selected.length === 1
	}
	isChoosed() {
		return this.selected.length > 0
	}
	isEmpty() {
		return this.selected.length === 0
	}
	isSelected(id: number | string) {
		return this.selected.includes(String(id))
	}
	deleteSelectedObject() {
		;[...this.selected].forEach(id => {
			this.deleteObject(id)
		})
	}
	toggleEnabled(id: number) {
		const index = this.objects.findIndex(object => object.id === id)
		if (index > -1) {
			this.objects[index].enabled = !this.objects[index].enabled
			this.objects[index] = this.objects[index].copy()
		}
	}
	selectedById(id: number, enabled: boolean) {
		if (enabled) {
			if (!this.isSelected(id)) {
				this.selected.push(String(id))
				this.selected = [...this.selected]
			}
		} else {
			if (this.isSelected(id)) {
				this.selected.splice(this.selected.indexOf(String(id)), 1)
				this.selected = [...this.selected]
			}
		}
	}

	moveX(value: number) {
		if (value === 0) {
			return
		}
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosX(round(this.objects[index].pos_x + value))
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
	moveY(value: number) {
		if (value === 0) {
			return
		}
		this.selectedIndex.forEach(index => {
			if (index > -1) {
				this.objects[index].setPosY(round(this.objects[index].pos_y + value))
				this.objects[index] = this.objects[index].copy()
			}
		})
	}
}

export const storeTemplate = new StoreTemplate()

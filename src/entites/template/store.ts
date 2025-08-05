import { makeAutoObservable } from 'mobx'
import { factoryElement } from '../element/factory-element'
import { exapmle } from './example'
const name = 'printer'

class StoreTemplate {
	dpi = 12
	// размеры этикетки
	width_label = 58
	height_label = 40
	radius_label = 5
	gap = 2
	DIRECTION_1 = 1
	DIRECTION_2 = 0
	ref_x = 0
	ref_y = 0
	objects = []
	scale = 1

	/////
	mm = 3.709575175750246
	cm = 37.09575175750246
	mm_qr = 3.999575175750246

	constructor() {
		makeAutoObservable(this)
		this.loadObjects(exapmle as any[])
	}

	get width() {
		return this.width_label * this.mm * this.scale
	}
	get height() {
		return this.height_label * this.mm * this.scale
	}
	get borderRadius() {
		return this.radius_label
	}
	get space() {
		return this.gap * this.mm * this.scale
	}

	get style() {
		return {
			width: this.width,
			height: this.height,
			borderRadius: this.borderRadius,
		}
	}
	get current() {
		if (this.objects.length) {
			return this.objects[this.objects.length - 1]
		}
	}
	loadObjects(objects: Array<any> = []) {
		this.objects = []
		objects.forEach(element => {
			this.objects.push(factoryElement(element) as never)
		})
	}
	setScale = (value: number | string) => {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.scale = value
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
		this.width_label = width
	}
	changeHeight(height: number | string) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		this.height_label = height
	}
	changeRadius(radius: number | string) {
		if (typeof radius === 'string') {
			radius = parseInt(radius, 10)
		}
		this.radius_label = radius
	}
	changeGap(gap: number | string) {
		if (typeof gap === 'string') {
			gap = parseInt(gap, 10)
		}
		this.gap = gap
	}
	// Обработка reference по оси x
	changeRefX = (value: number | string) => {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.ref_x = value
	}
	// Обработка reference по оси y
	changeRefY = (value: number | string) => {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.ref_y = value
	}
	// Обработка derection
	changeDirection1 = (value: number | string) => {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.DIRECTION_1 = value
	}
	changeDirection2 = (value: number | string) => {
		if (typeof value === 'string') {
			value = parseInt(value, 10)
		}
		this.DIRECTION_2 = value
	}

	setCurrent(object) {
		this.objects[this.objects.length - 1] = object.copy()
	}
	setName(name: string) {
		this.current.setName(name)
		this.setCurrent(this.current)
	}
	setWidth(width: string | number) {
		this.current.setWidth(width)
		this.setCurrent(this.current)
	}
	setHeight(height: string | number) {
		this.current.setHeight(height)
		this.setCurrent(this.current)
	}
	setPosX(pos_x: string | number) {
		this.current.setPosX(pos_x)
		this.setCurrent(this.current)
	}
	setPosY(pos_y: string | number) {
		this.current.setPosY(pos_y)
		this.setCurrent(this.current)
	}
	setRotation(rotation: string | number) {
		this.current.setRotation(rotation)
		this.setCurrent(this.current)
	}
}

export const storeTemplate = new StoreTemplate()

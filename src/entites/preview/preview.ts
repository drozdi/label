import { CM, MM, MM_QR } from '../../shared/constants'
import { roundInt } from '../../shared/utils'
import { factoryElement } from '../element/factory-element'

export class Preview {
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

	/////
	mm = MM
	cm = CM
	mm_qr = MM_QR

	////
	currId: number | string = 0
	currIndex = -1

	selected: Array<number | string> = []

	constructor(tmp) {
		for (const prop of [
			'name',
			'width_mm',
			'height_mm',
			'radius_label',
			'gap_mm',
			'direction_x',
			'direction_y',
			'reference_x',
			'reference_y',
			'scale',
			'id',
		]) {
			if (tmp[prop] !== undefined) {
				this[prop] = tmp[prop]
			}
		}
		this.objects = []
		tmp?.objects?.forEach(element => {
			this.addObject(element)
		})

		//*/
	}

	get width() {
		return roundInt(this.width_mm * this.mm * this.scale)
	}
	get height() {
		return roundInt(this.height_mm * this.mm * this.scale)
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

	addObject(object) {
		this.objects.push(factoryElement(object.getCorrectProps?.() || object) as never)
	}
	setScale(scale) {
		this.scale = scale
	}
}

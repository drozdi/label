import { CM, MM, MM_QR } from '../../shared/constants'
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
		for (const prop in tmp) {
			if (tmp[prop] !== undefined && prop !== 'objects') {
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
		return this.width_mm * this.mm * this.scale
	}
	get height() {
		return this.height_mm * this.mm * this.scale
	}
	get borderRadius() {
		return this.radius_label
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

	addObject(object) {
		this.objects.push(factoryElement(object) as never)
	}
}

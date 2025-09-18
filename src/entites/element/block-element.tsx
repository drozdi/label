import { round } from '../../shared/utils'
import { storeFonts } from '../fonts/store'
import { BaseElement } from './base-element'

export class BlockElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			font_id: storeFonts.default?.id,
			width: 50,
			height: 20,
			font_size: 12,
			...object,
			type: 'block',
		})
	}
	get properties() {
		return [
			'enabled',
			'name',
			'pos_x',
			'pos_y',
			'width',
			'height',
			'rotation',
			'font_size',
			'font_id',
			'text_align',
			'data',
		]
	}
	get multiProperties() {
		return ['enabled', 'rotation', 'font_id', 'font_size', 'text_align']
	}
	get resize() {
		return ['e', 's', 'se']
	}
	style(scale = 1) {
		let width = this.width * this.mm * scale
		let height = this.height * this.mm * scale
		let left = this.pos_x * this.mm * scale
		let top = this.pos_y * this.mm * scale

		if (this.rotation === 90) {
			left += height
		}

		return { ...super.style(scale), left: round(left) }
	}
}

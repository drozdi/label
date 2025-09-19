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
}

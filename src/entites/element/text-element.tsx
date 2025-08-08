import { storeFonts } from '../fonts/store'
import { BaseElement } from './base-element'

export class TextElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			font_id: storeFonts.defaultFont?.id,
			width: 'fit-content',
			height: 'fit-content',
			font_size: 12,
			...object,
			type: 'text',
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
			'data',
		]
	}
}

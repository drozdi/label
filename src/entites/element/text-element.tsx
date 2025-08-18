import { storeFonts } from '../fonts/store'
import { BaseElement } from './base-element'

export class TextElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			font_id: storeFonts.defaultFont?.id,
			font_size: 12,
			...object,
			type: 'text',
			width: 'fit-content',
			height: 'fit-content',
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
	getProps() {
		return { ...super.getProps() }
	}
}

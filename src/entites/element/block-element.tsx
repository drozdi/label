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
	get resize() {
		return ['e', 's', 'se']
	}
	style(scale = 1, element) {
		let width, height, _width, _height
		let left = this.pos_x * this.mm * scale
		let top = this.pos_y * this.mm * scale

		if (this.width === 'fit-content') {
			_width = element?.getBoundingClientRect()?.width
			width = 'auto'
		} else {
			width = this.width * this.mm * scale
		}
		if (this.height === 'fit-content') {
			_height = element?.getBoundingClientRect()?.height
			height = 'auto'
		} else {
			height = this.height * this.mm * scale
		}

		_width ??= width
		_height ??= height
		if (_width !== 'auto' && _height !== 'auto') {
			if (this.rotation === 90) {
				left += (_height - _width) / 2
				top += (_width - _height) / 2
			} else if (this.rotation === 180) {
				left -= _width
				top -= _height
			} else if (this.rotation === 270) {
				left -= (_width - _height) / 2
				top -= (_width + _height) / 2
			}
		}

		return { ...super.style(scale, element), left, top }
	}
}

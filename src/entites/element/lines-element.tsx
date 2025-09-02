import { BaseElement } from './base-element'

export class LinesElement extends BaseElement {
	constructor(object: Record<string, any>) {
		const parseObject = {
			width: object.width - object.pos_x,
			pos_y: object.height,
			height: object.line_thickness,
		}

		super({
			...object,
			...parseObject,
			type: 'lines',
		})
	}
	get properties() {
		return ['enabled', 'name', 'pos_x', 'pos_y', 'width', 'height']
	}
	get resize() {
		return ['se']
	}
	getCorrectProps() {
		return {
			...super.getCorrectProps(),
			width: this.pos_x + this.width,
			height: this.pos_y,
			line_thickness: this.height,
		}
	}
	style(scale = 1, element) {
		return {
			...super.style(scale, element),
			outline: 0,
			borderRadius: 0,
			background: 'black',
			rotate: 0,
		}
	}
}

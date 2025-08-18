import { BaseElement } from './base-element'

export class LinesElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			width: 15,
			height: 1,
			...object,
			type: 'lines',
		})
	}
	get properties() {
		return ['enabled', 'name', 'pos_x', 'pos_y', 'width', 'height', 'rotation']
	}
	get resize() {
		return ['e']
	}
	style(scale = 1, element) {
		return {
			...super.style(scale, element),
			outline: 0,
			borderRadius: 0,
			background: 'black',
		}
	}
}

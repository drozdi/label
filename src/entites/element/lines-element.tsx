import { round } from '../../shared/utils'
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
			rotate: 0,
		}
	}
	setHeight(height: string | number) {
		super.setHeight(height)
		this.setLineThickness(height)
	}
	setRotation(rotation: string | number) {
		super.setRotation(rotation)
		if (this.rotation === 0 || this.rotation === 180) {
			this.setWidth(round(this.pos_x + this.width))
			this.setHeight(round(this.pos_y))
			this.line_thickness = round(this.height)
		} else {
			this.setWidth(round(this.pos_x))
			this.setHeight(round(this.pos_y + this.height))
			this.line_thickness = round(this.width)
		}
	}
}

import { BaseElement } from './base-element'

export class BoxElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			width: 15,
			height: 15,
			...object,
			type: 'box',
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
			'radius',
			'line_thickness',
		]
	}
	style(element, scale = 1) {
		return {
			...super.style(element, scale),
			border: 0,
			borderRadius: 0,
		}
	}
	render(scale = 1) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					border: this.line_thickness / 2 + 'px solid',
					borderRadius: this.radius / 2 + 'px',
				}}
			></div>
		)
	}
}

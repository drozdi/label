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
		return ['enabled', 'name', 'pos_x', 'pos_y', 'width', 'height', 'radius', 'line_thickness']
	}
	get multiProperties() {
		return ['enabled']
	}
	get resize() {
		return ['e', 's', 'se']
	}
	style(scale = 1) {
		return {
			...super.style(scale),
			outline: 0,
			borderRadius: 0,
		}
	}
	render(scale = 1) {
		return (
			<div
				style={{
					width: '100%',
					height: '100%',
					border: this.line_thickness * scale * this.mm + 'px solid',
					borderRadius: this.radius + 'px',
				}}
			></div>
		)
	}
}

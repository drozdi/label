import { storeFonts } from '../fonts/store'
import { BaseElement } from './base-element'

export class TextElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			font_id: storeFonts.id,
			font_size: 12,
			...object,
			type: 'text',
			width: 'fit-content',
			height: 'fit-content',
		})
	}
	get properties() {
		return ['enabled', 'name', 'pos_x', 'pos_y', 'rotation', 'font_size', 'font_id', 'data']
	}
	get multiProperties() {
		return ['enabled', 'rotation', 'font_id', 'font_size', 'text_align']
	}
	render(scale = 1, preview = false) {
		return (
			<>
				<div data-content>{super.render(scale, preview)}</div>
			</>
		)
	}
	// setData(value: string): void {
	// 	const element = document.getElementById(this.id)
	// 	if (element) {
	// 		const content = element.querySelector('[data-content]')
	// 		content.style.width = element.style.width
	// 		content.style.height = element.style.height
	// 		element.style.width = 'auto'
	// 		element.style.height = 'auto'
	// 	}
	// 	super.setData(value)
	// }
	// style(scale = 1) {
	// 	return { ...super.style(scale), overflow: 'hidden' }
	// }
	// getProps() {
	// 	return { ...super.getProps(), width: 0, height: 0 }
	// }
}

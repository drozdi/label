import { storeFonts } from '../fonts/store'
import { BaseElement } from './base-element'

/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text: string, font: string): number {
	// re-use canvas object for better performance
	const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
	const context = canvas.getContext('2d')
	context.font = font
	const metrics = context.measureText(text)
	return metrics.width
}

export class TextElement extends BaseElement implements IObject {
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
	style(scale = 1) {
		return {
			...super.style(scale),
			width: getTextWidth((this.data || '') + ' ', `${this.font_size * scale}px ${this.fontFamily}`),
		}
	}
}

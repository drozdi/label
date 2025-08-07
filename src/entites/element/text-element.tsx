import { BaseElement } from './base-element'
export class TextElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			...object,
			type: 'text',
		})
	}
}

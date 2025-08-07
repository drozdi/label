import { BaseElement } from './base-element'
export class BlockElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			...object,
			type: 'block',
		})
	}
}

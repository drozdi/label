import { BaseElement } from './base-element'
import { TextElement } from './text-element'

export function factoryElement(object: Record<string, any>): BaseElement {
	switch (object.type) {
		case 'text':
			return new TextElement({ ...object })
		default:
			return new BaseElement({ ...object })
	}
}

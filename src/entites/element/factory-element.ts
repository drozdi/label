import { BaseElement } from './base-element'
import { BlockElement } from './block-element'
import { ImgElement } from './img-element'
import { TextElement } from './text-element'

export function factoryElement(object: Record<string, any>): BaseElement {
	switch (object.type) {
		case 'text':
			return new TextElement({ ...object })
		case 'block':
			return new BlockElement({ ...object })
		case 'img':
			return new ImgElement({ ...object })
		default:
			return new BaseElement({ ...object })
	}
}

import { BarcodeElement } from './barcode-element'
import { BaseElement } from './base-element'
import { BlockElement } from './block-element'
import { BoxElement } from './box-element'
import { ImgElement } from './img-element'
import { LinesElement } from './lines-element'
import { TextElement } from './text-element'

export function factoryElement(object: Record<string, any>): BaseElement {
	switch (object.type) {
		case 'text':
			return new TextElement({ ...object })
		case 'block':
			return new BlockElement({ ...object })
		case 'img':
			return new ImgElement({ ...object })
		case 'barcode':
			return new BarcodeElement({ ...object })
		case 'lines':
			return new LinesElement({ ...object })
		case 'box':
			return new BoxElement({ ...object })
		default:
			return new BaseElement({ ...object })
	}
}

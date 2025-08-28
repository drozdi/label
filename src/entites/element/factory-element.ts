import { BarcodeElement } from './barcode-element'
import { BaseElement } from './base-element'
import { BlockElement } from './block-element'
import { BoxElement } from './box-element'
import { ImgElement } from './img-element'
import { LinesElement } from './lines-element'
import { TextElement } from './text-element'

export function factoryElement(object: Record<string, any>): BaseElement {
	const corecctProps = object.getCorrectProps?.() || object

	switch (corecctProps.type) {
		case 'text':
			return new TextElement({ ...corecctProps })
		case 'block':
			return new BlockElement({ ...corecctProps })
		case 'img':
			return new ImgElement({ ...corecctProps })
		case 'barcode':
			return new BarcodeElement({ ...corecctProps })
		case 'lines':
			return new LinesElement({ ...corecctProps })
		case 'box':
			return new BoxElement({ ...corecctProps })
		default:
			return new BaseElement({ ...corecctProps })
	}
}

import { storeImages } from '../images/store'
import { BaseElement } from './base-element'
export class ImgElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			image_id: storeImages.default?.id,
			width: 15,
			height: 15,
			...object,
			type: 'img',
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
			'image_id',
			'type',
		]
	}
	get resize() {
		return ['e', 's', 'se']
	}
	render(scale = 1, preview = false): React.ReactNode {
		return (
			<img
				src={`data:image/bmp;base64,${this.imageData}`}
				alt={this.imageName}
			/>
		)
	}
}

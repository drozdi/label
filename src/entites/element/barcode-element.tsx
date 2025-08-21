import bwipjs from 'bwip-js'
import { useEffect, useState } from 'react'
import { BaseElement } from './base-element'

export class BarcodeElement extends BaseElement {
	constructor(object: Record<string, any>) {
		super({
			radius: 1.833,
			font_size: 9,
			...object,
			type: 'barcode',
		})
	}
	get properties() {
		const props = [
			'enabled',
			'name',
			'pos_x',
			'pos_y',
			'width',
			'height',
			'rotation',
			'data',
		]
		if (this.code_type === 'ean13' || this.code_type === 'code128') {
			props.push('human_readable')
		}
		return props
	}
	render(scale = 1, preview = false): React.ReactNode {
		const prefix = preview ? '_preview' : ''
		const style = {
			fontSize: this.font_size,
			position: 'absolute',
			bottom: -this.font_size - 1,
			width: '100%',
			margin: 0,
			lineHeight: 1,
		}
		const [body, setBody] = useState(
			this.data.length >= 13 ? this.data : '0000000000000'
		)
		useEffect(() => {
			try {
				if (this.code_type === 'ean13' || this.code_type === 'code128') {
					bwipjs.toCanvas('mycanvas' + this.id + prefix, {
						scaleX: this.width,
						scaleY: 2,
						bcid: this.code_type,
						text: body,
						height: this.height * 2,
					})
				} else if (this.code_type === 'datamatrix') {
					bwipjs.toCanvas('mycanvas' + this.id + prefix, {
						bcid: 'datamatrix',
						text: '^FNC1' + this.name,
						height: this.height * this.min_size,
						width: this.width * this.min_size,
						parsefnc: true,
					})
				} else {
					bwipjs.toCanvas('mycanvas' + this.idprefix, {
						bcid: this.code_type,
						text: this.data,
						height: this.height,
						width: this.width,
					})
				}
			} catch (e) {
				console.error('Error generating barcode:', e)
			}
		}, [this, prefix, body])
		return (
			<>
				<canvas
					id={'mycanvas' + this.id + prefix}
					style={{
						height:
							this.code_type === 'qrcode'
								? this.height * this.mm_qr * scale + 'px'
								: this.code_type === 'datamatrix' && this.min_size === 0
								? this.height * 1.833 * this.mm * scale + 'px'
								: this.code_type === 'datamatrix' && this.min_size !== 0
								? this.height * this.min_size * this.mm * scale + 'px'
								: this.height * this.mm * scale + 'px',
					}}
				></canvas>
				{this.human_readable === 1 ? (
					<p
						style={{
							...style,
							textAlign: 'start',
						}}
					>
						{this.data}
					</p>
				) : this.human_readable === 2 ? (
					<p
						style={{
							...style,
							textAlign: 'center',
						}}
					>
						{this.data}
					</p>
				) : this.human_readable === 3 ? (
					<p
						style={{
							...style,
							textAlign: 'end',
						}}
					>
						{this.data}
					</p>
				) : (
					<></>
				)}
			</>
		)
	}
	get size() {
		return Math.max(this.width, this.height)
	}
	get min_size() {
		return this.radius
	}
	style(scale = 1, element) {
		const style = super.style(scale, element)
		if (this.code_type === 'datamatrix') {
			/*style.width = style.width * this.min_size
			style.height = style.height * this.min_size //*/
			style.width = 'auto'
			style.height = 'auto' //*/
		} else if (this.code_type === 'ean13' || this.code_type === 'code128') {
			style.width = 'auto'
			style.height = 'auto'
		}
		style.outline = 0
		style.borderRadius = 0
		return style
	}
	setWidth(width: string | number) {
		if (typeof width === 'string') {
			width = parseInt(width, 10)
		}
		this.width = width
		if (this.code_type !== 'ean13' && this.code_type !== 'code128') {
			this.height = width
		}
	}
	setHeight(height: string | number) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		if (this.code_type !== 'ean13' && this.code_type !== 'code128') {
			this.width = height
		}
		this.height = height
	}
}

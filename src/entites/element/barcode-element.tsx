import bwipjs from 'bwip-js'
import { useEffect, useRef } from 'react'
import { minMax, round } from '../../shared/utils'
import { BaseElement } from './base-element'

export class BarcodeElement extends BaseElement implements IObject {
	constructor(object: Record<string, any>) {
		super({
			radius: 1.833,
			font_size: 9,
			...object,
			type: 'barcode',
		})
	}
	get properties() {
		const props = ['enabled', 'name', 'pos_x', 'pos_y', 'width', 'height', 'data']
		if (this.code_type === 'ean13' || this.code_type === 'code128') {
			props.push('human_readable', 'rotation')
		} else if (this.code_type === 'qrcode') {
			props.push('rotation')
		}

		return props
	}
	get multiProperties() {
		if (this.code_type === 'ean13' || this.code_type === 'code128' || this.code_type === 'qrcode') {
			return ['enabled', 'rotation']
		}
		return ['enabled']
	}
	render(scale = 1, preview = false): React.ReactNode {
		const ref = useRef<HTMLDivElement>(null)
		const prefix = preview ? '_preview' : ''
		const style = {
			fontSize: this.font_size,
			position: 'absolute',
			bottom: -this.font_size - 1,
			width: '100%',
			margin: 0,
			lineHeight: 1,
		}

		// console.log(this.width)
		// console.log(this.width * this.mm)
		// console.log({ ...this })

		useEffect(() => {
			try {
				if (this.code_type === 'ean13' || this.code_type === 'code128') {
					// let svg = bwipjs.toSVG({
					// 	bcid: this.code_type,
					// 	text: this.data,
					// 	scaleX: this.width,
					// 	scaleY: 2,
					// 	height: round(this.height + 1) * 2,
					// })
					// let [, width, height] = /viewBox="0 0 (\d+) (\d+)"/.exec(svg)

					// ref.current.style.display = 'inline-block'
					// //ref.current.style.width = width + 'px'
					// ref.current.style.height = this.height * this.mm * scale + 'px'
					// ref.current.innerHTML = svg
					bwipjs.toCanvas('mycanvas' + this.id + prefix, {
						bcid: this.code_type,
						text: this.data,
						scaleX: this.width,
						scaleY: 2,
						height: round(this.height + 1) * 2,
					})
				} else if (this.code_type === 'datamatrix') {
					bwipjs.toCanvas('mycanvas' + this.id + prefix, {
						bcid: this.code_type,
						width: round(this.width * this.min_size),
						height: round(this.height * this.min_size),
						text: '^FNC1' + this.name,
						parsefnc: true,
					})
				} else {
					bwipjs.toCanvas('mycanvas' + this.id + prefix, {
						bcid: this.code_type,
						width: round(this.width),
						height: round(this.height),
						text: this.data,
					})
				}
			} catch (e) {
				console.error('Error generating barcode:', e)
			}
		}, [this, this.data, prefix])

		return (
			<>
				<canvas
					id={'mycanvas' + this.id + prefix}
					style={{
						height: round(
							this.code_type === 'qrcode'
								? this.height * this.mm_qr * scale
								: this.code_type === 'datamatrix' && this.min_size === 0
									? this.height * 1.833 * this.mm * scale
									: this.code_type === 'datamatrix' && this.min_size !== 0
										? this.height * this.min_size * this.mm * scale
										: this.height * this.mm * scale
						),
					}}
				/>
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
	get min_size() {
		return this.radius
	}
	style(scale = 1) {
		const style = super.style(scale)
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
		if (this.code_type !== 'ean13' && this.code_type !== 'code128') {
			width = minMax(width, 3)
			this.height = width
		}
		this.width = width
	}
	setHeight(height: string | number) {
		if (typeof height === 'string') {
			height = parseInt(height, 10)
		}
		if (this.code_type !== 'ean13' && this.code_type !== 'code128') {
			height = minMax(height, 3)
			this.width = height
		}
		this.height = height
	}
}

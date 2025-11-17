import { SegmentedControl, Stack, Textarea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { storeTemplate } from '../../entites/template/store'

const tsplGenCode = {
	gen(template: Record<string, any>, dpi: number): string {
		let res = ''

		res += this.genSIZE(template.width_mm + ' mm ,' + template.height_mm + ' mm') + '\n'
		res += this.genGAP(template.gap_mm + ' mm') + '\n'
		res += this.genDIRECTION([template.direction_x, template.direction_y].join(',')) + '\n'
		res += this.genREFERENCE([template.reference_x, template.reference_y].join(',')) + '\n'

		template.objects.forEach(object => {
			switch (object.type) {
				case 'box':
					res += this.genBOX(object, dpi) + '\n'
					break
				case 'bar':
					res += this.genBAR(object, dpi) + '\n'
					break
				case 'block':
					res += this.genBLOCK(object, dpi) + '\n'
					break
				case 'text':
					res += this.genTEXT(object, dpi) + '\n'
					break
				case 'img':
					res += this.genIMG(object, dpi) + '\n'
					break
				case 'barcode':
					res += this.genBARCODE(object, dpi) + '\n'
					break
			}
		})
		return res
	},
	genTEXT(object: Record<string, any>, dpi: number): string {
		let arr = []
		arr.push(Math.round(Number(object.pos_x) * dpi))
		arr.push(Math.round(Number(object.pos_y) * dpi))
		arr.push('"font"')
		arr.push(object.rotation)
		arr.push(object.font_size)
		arr.push(object.font_size)
		arr.push(object.text_align)
		arr.push(`"${object.data}"`)
		return 'TEXT ' + arr.join(', ')
	},
	genBLOCK(object: Record<string, any>, dpi: number): string {
		let arr = []
		arr.push(Math.round(Number(object.pos_x) * dpi))
		arr.push(Math.round(Number(object.pos_y) * dpi))
		arr.push(Math.round(Number(object.width) * dpi))
		arr.push(Math.round(Number(object.height) * dpi))
		arr.push('"font"')
		arr.push(object.rotation)
		arr.push(object.font_size)
		arr.push(object.font_size)
		arr.push(0)
		arr.push(object.text_align)
		arr.push(0)
		arr.push(`"${object.data}"`)
		return 'BLOCK ' + arr.join(', ')
	},
	genIMG(object: Record<string, any>, dpi: number): string {
		let arr = []
		arr.push(Math.round(Number(object.pos_x) * dpi))
		arr.push(Math.round(Number(object.pos_y) * dpi))
		arr.push('"image"')
		return 'PUTBMP ' + arr.join(', ')
	},
	genBOX(object: Record<string, any>, dpi: number): string {
		let arr = []
		arr.push(Math.round(Number(object.pos_x) * dpi))
		arr.push(Math.round(Number(object.pos_y) * dpi))
		arr.push(Math.round((Number(object.pos_x) + Number(object.width)) * dpi))
		arr.push(Math.round((Number(object.pos_y) + Number(object.height)) * dpi))
		arr.push(Math.round(Number(object.line_thickness) * dpi))
		arr.push(Number(object.radius))
		return 'BOX ' + arr.join(', ')
	},
	genBAR(object: Record<string, any>, dpi: number): string {
		let arr = []
		arr.push(Math.round(Number(object.pos_x) * dpi))
		arr.push(Math.round(Number(object.pos_y) * dpi))
		arr.push(Math.round(Number(object.width) * dpi))
		arr.push(Math.round(Number(object.line_thickness) * dpi))
		return 'BAR ' + arr.join(', ')
	},
	genBARCODE(object: Record<string, any>, dpi: number): string {
		switch (object.code_type) {
			case 'qrcode':
				return this.genQRCODE(object, dpi)
			case 'datamatrix':
				return this.genDATAMATRIX(object, dpi)
			case 'ean13':
				return this.genCODE(object, dpi)
			case 'code128':
				return this.genCODE(object, dpi)
		}

		return ' '
	},
	genQRCODE(object: Record<string, any>, dpi: number): string {
		let arr = []
		// x
		arr.push(Math.round(Number(object.pos_x) * dpi))
		// y
		arr.push(Math.round(Number(object.pos_y) * dpi))
		// ECC level
		arr.push('M')
		// cell width
		arr.push(object.width - 4)
		// mode
		arr.push('A')
		// rotation
		arr.push(object.rotation)
		// justification
		// arr.push('')
		// model
		arr.push('M1')
		// mask
		arr.push('S7')
		// area
		// arr.push('')
		// content
		arr.push(`"${object.data}"`)
		return 'QRCODE  ' + arr.join(', ')
	},
	genDATAMATRIX(object: Record<string, any>, dpi: number): string {
		let arr = []
		// x
		arr.push(Math.round(Number(object.pos_x) * dpi))
		// y
		arr.push(Math.round(Number(object.pos_y) * dpi))
		// width
		arr.push(Math.round(Number(object.width) * dpi))
		// height
		arr.push(Math.round(Number(object.height) * dpi))
		// c
		arr.push('c126')
		// x
		arr.push('x' + object.width)
		// r
		arr.push('r' + object.rotation)
		// a
		// arr.push("a"+Math.round(Number(object.pos_y) * dpi))
		// row
		arr.push(Math.round(Number(object.width) * dpi))
		// col
		arr.push(Math.round(Number(object.height) * dpi))
		// content
		arr.push(`"${object.data}"`)
		return 'DATAMATRIX ' + arr.join(', ')
	},
	genCODE(object: Record<string, any>, dpi: number): string {
		let arr = []
		// x
		arr.push(Math.round(Number(object.pos_x) * dpi))
		// y
		arr.push(Math.round(Number(object.pos_y) * dpi))
		// code type
		arr.push(`"${object.code_type === 'ean13' ? 'EAN13' : object.code_type === 'code128' ? '128' : ''}"`)
		// height
		arr.push(Math.round(Number(object.height) * dpi))
		// human readable
		arr.push(object.human_readable)
		// rotation
		arr.push(object.rotation)
		// narrow
		arr.push(2)
		// wide
		arr.push(object.width)
		// [alignment,]
		object.human_readable > 0 && arr.push(object.human_readable)
		// "content"
		arr.push(`"${object.data}"`)
		return 'BARCODE ' + arr.join(', ')
	},
	genDIRECTION(str: string): string {
		return 'DIRECTION ' + str
	},
	genSIZE(str: string): string {
		return 'SIZE ' + str
	},
	genGAP(str: string): string {
		return 'GAP ' + str
	},
	genREFERENCE(str: string): string {
		return 'REFERENCE ' + str
	},
}

export const GenCode = observer(() => {
	const [type, setType] = useState<'tspl' | 'ezpl' | 'zpl'>('tspl')
	const [dpi, setDpi] = useState<'8' | '12'>('12')
	const [res, setRes] = useState<string>('')
	useEffect(() => {
		let res = tsplGenCode.gen(storeTemplate, Number(dpi))
		setRes(res)
	}, [type, dpi])
	return (
		<Stack>
			<SegmentedControl value={type} onChange={setType} data={['tspl', 'ezpl', 'zpl']} />
			<SegmentedControl
				value={dpi}
				onChange={setDpi}
				data={[
					{ value: '12', label: '300' },
					{ value: '8', label: '200' },
				]}
			/>
			<Textarea value={res} rows={30}></Textarea>
		</Stack>
	)
})

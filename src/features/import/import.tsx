import {
	Button,
	FileButton,
	Group,
	Modal,
	Stack,
	Textarea,
	Title,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { storeTemplate } from '../../entites/template/store'
import { serviceNotifications } from '../../services/notifications/service'
import { genId, round } from '../../shared/utils'
import { useAppContext } from '../context'

function genObj(def = {}) {
	return {
		id: genId(),
		name: null,
		text_align: 1,
		human_readable: 0,
		radius: 0,
		line_thickness: 0.0,
		enabled: true,
		type: null,
		pos_x: 0.0,
		pos_y: 0.0,
		width: 0.0,
		height: 0.0,
		rotation: 0.0,
		code_type: null,
		font_size: 12,
		font_id: 0,
		image_id: 0,
		data: null,
		template_id: null,
		...def,
	}
}
function parseSplit(str: string): any[] {
	return str
		.trim()
		.split(',')
		.map(v => v.trim())
}
function removeQuote(str: string) {
	return str.replace(/^"/, '').replace(/"$/, '')
}

const setDirection = (x: number, y: number) => {
	if (x < 0 || x > 1) {
		throw new Error(
			`Неверное значение значение derection по x-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${x} в шаблон`
		)
	}
	if (y < 0 || y > 1) {
		throw new Error(
			`Неверное значение значение derection по y-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${y} в шаблон`
		)
	}
	storeTemplate.changeDirection1(x)
	//storeTemplate.changeDirection2(y);
}
const setSize = (w: number, h: number) => {
	if (w < 15 || w > 150) {
		throw new Error(
			`Неверное значение ширины. Нижний порог ширины 15мм, верхний 150мм. Вы пытаетесь записать значение ${w}`
		)
	}
	if (h < 15 || h > 400) {
		throw new Error(
			`Неверное значение высоты. Нижний порог высоты 15мм, верхний 150мм. Вы пытаетесь записать значение ${h}`
		)
	}
	storeTemplate.changeWidth(w)
	storeTemplate.changeHeight(h)
}
const setGap = (gap: number) => {
	if (gap < 0 || gap > 30) {
		throw new Error(`Неверное значение gap.`)
	}
	storeTemplate.changeGap(gap)
}
const setReference = (x: number, y: number) => {
	storeTemplate.changeRefX(x)
	storeTemplate.changeRefY(y)
}

const regParse = (reg: RegExp, str: string, def = {}) => {
	if (reg.test(str)) {
		return { ...def, ...str.match(reg).groups }
	}
	return { ...def }
}

export const Import = observer(() => {
	const ctx = useAppContext()
	const refText = useRef<HTMLTextAreaElement>(null)
	const handleFile = (file: any) => {
		if (!file.name.toLowerCase().match(/\.txt$/g)) {
			serviceNotifications.error('Необходимо загрузить файл с разрешением txt')
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			refText.current.value = reader.result
		}
		reader.readAsText(file)
	}

	const [{ unprocessedKey, unprocessedBody }, setUnprocessed] = useState({
		unprocessedKey: [],
		unprocessedBody: [],
	})

	const tsplParser = {
		test(str: string) {
			return true
		},
		parse(str: string) {
			const lines = str
				.trim()
				.split(/\n/)
				.map(v => String(v).trim())
			lines.forEach(line => this.parseLine(line))
		},
		parseLine(line: string) {
			;[
				'DIRECTION',
				'SIZE',
				'GAP',
				'REFERENCE',
				'DMATRIX',
				'TEXT',
				'BLOCK',
				'BARCODE',
				'QRCODE',
				'PUTBMP',
				'BOX',
				'BAR',
			].forEach(v => {
				const reg = new RegExp(`^${v}`)
				if (reg.test(line)) {
					this[`parse${v}`]?.(line.replace(reg, ''))
				}
			})
		},
		parseDIRECTION(str: string) {
			const arr = parseSplit(str).map(v => Number(v.trim()))
			setDirection(...arr)
		},
		parseSIZE(str: string) {
			const arr = parseSplit(str).map(v => parseInt(v, 10))
			setSize(...arr)
		},
		parseGAP(str: string) {
			const arr = parseSplit(str).map(v => parseInt(v, 10))
			setGap(...arr)
		},
		parseREFERENCE(str: string) {
			const arr = parseSplit(str).map(v => parseInt(v, 10))
			setReference(...arr)
		},
		parseDMATRIX(str: string) {
			//ctx.setDataMatrixFlag(true)
			const obj = genObj({
				name: storeDataMatrix.fakeBodyDM,
				type: 'barcode',
				code_type: 'datamatrix',
				radius: 1.8333333333333333,
				temp: true,
				width: 6,
			})

			const res = regParse(
				/(?:DMATRIX)?\s*(?<pos_x>-?[0-9]*)\s*,\s*(?<pos_y>-?[0-9]*)\s*,\s*(?<width>-?[0-9]*)\s*,\s*(?<height>-?[0-9]*)(?:\s*,\s*[cC](?<c>[0-9]*))?(?:\s*,\s*[xX](?<x>[0-9]*))?(?:\s*,\s*[rR](?<r>[0-9]*))?(?:\s*,\s*[aA](?<a>[01]*))?(?:\s*,\s*(?<row>[0-9]*))?(?:\s*,\s*(?<col>[0-9]*))?,\s*"(?<data>.*)"/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					width: 0,
					height: 0,
					c: 0,
					x: 0,
					r: 0,
					a: 0,
					row: 0,
					col: 0,
					data: '',
				}
			)

			obj.pos_x = parseInt(res.pos_x, 10) / storeTemplate.dpi
			obj.pos_y = parseInt(res.pos_y, 10) / storeTemplate.dpi
			obj.width = parseInt(res.width, 10) / storeTemplate.dpi
			obj.height = parseInt(res.height, 10) / storeTemplate.dpi

			if (res.x) {
				obj.width = parseInt(res.x, 10)
			} else {
				obj.width = 6
			}
			if (res.r) {
				obj.rotation = parseInt(res.r, 10) || 0
			}
			if (res.row) {
				obj.width = parseInt(res.row, 10)
			}

			obj.data = res.data

			const dm = storeDataMatrix._selectedDM(storeDataMatrix.findByDM(obj.name))

			obj.radius = dm.size / storeTemplate.dpi
			obj.height = obj.width

			storeTemplate.addObject(obj)
		},
		parseTEXT(str: string) {
			const obj = genObj({
				name: 'text',
				type: 'text',
				width: 'fit-content',
				height: 'fit-content',
				font_size: 12,
				font_id: storeFonts.id,
			})

			const res = regParse(
				/(?:TEXT)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*"(?<font>.*)"\s*,\s*(?<rotation>[0-9]*)\s*,\s*(?<x_multiplication>[0-9]*)\s*,\s*(?<y_multiplication>[0-9]*)(?:\s*,\s*(?<alignment>[0123]*))?\s*,\s*"(?<data>.*)"/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					x_multiplication: 12,
					y_multiplication: 12,
					data: '',
				}
			)

			obj.pos_x = parseInt(res.pos_x, 10) / storeTemplate.dpi
			obj.pos_y = parseInt(res.pos_y, 10) / storeTemplate.dpi

			let font
			if ((font = storeFonts.findByTagFonts(res.font))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findByName(res.font))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findById(res.font))) {
				obj.font_id = font.id
			} else {
				serviceNotifications.alert(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)
			}

			obj.rotation = parseInt(res.rotation, 10)

			if (obj.rotation === 90 || obj.rotation === 270) {
				obj.font_size = parseInt(res.y_multiplication, 10)
			} else {
				obj.font_size = parseInt(res.x_multiplication, 10)
			}

			obj.data = res.data

			storeTemplate.addObject(obj)
		},
		parseBLOCK(str: string) {
			const obj = genObj({
				name: 'block',
				type: 'block',
				font_size: 12,
				font_id: storeFonts.id,
			})

			const res = regParse(
				/(?:BLOCK)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<width>[0-9]*)\s*,\s*(?<height>[0-9]*)\s*,\s*"(?<font>.*)"\s*,\s*(?<rotation>[0-9]*)\s*,\s*(?<x_multiplication>[0-9]*)\s*,\s*(?<y_multiplication>[0-9]*)(?:\s*,\s*(?<space>[0-9]*))?(?:\s*,\s*(?<alignment>[0123]))?\s*,\s*"(?<data>.*)"/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					width: 0,
					height: 0,
					rotation: 0,
					x_multiplication: 12,
					y_multiplication: 12,
					alignment: 0,
					space: 0,
					data: '',
				}
			)

			obj.pos_x = parseInt(res.pos_x, 10) / storeTemplate.dpi
			obj.pos_y = parseInt(res.pos_y, 10) / storeTemplate.dpi
			obj.width = parseInt(res.width, 10) / storeTemplate.dpi
			obj.height = parseInt(res.height, 10) / storeTemplate.dpi

			let font
			if ((font = storeFonts.findByTagFonts(res.font))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findByName(res.font))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findById(res.font))) {
				obj.font_id = font.id
			} else {
				serviceNotifications.alert(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)
			}

			obj.rotation = parseInt(res.rotation ?? 0, 10)

			if (obj.rotation === 90 || obj.rotation === 270) {
				obj.font_size = parseInt(res.y_multiplication, 10)
			} else {
				obj.font_size = parseInt(res.x_multiplication, 10)
			}

			obj.text_align = parseInt(res.alignment ?? 0, 10)
			obj.data = res.data

			storeTemplate.addObject(obj)
		},
		parseBARCODE(str: string) {
			const obj = genObj({
				name: 'barcode',
				type: 'barcode',
			})
			const res = regParse(
				/(?:BARCODE)?\s*(?<pos_x>-?[0-9]*)\s*,\s*(?<pos_y>-?[0-9]*)\s*,\s*"(?<type>.*)"\s*,\s*(?<height>[0-9]*)\s*,\s*(?<human_readable>[0123]*)\s*,\s*(?<rotation>[0-9]*)\s*,\s*(?<narrow>[0-9]*)\s*,\s*(?<wide>[0-9]*)(?:\s*,\s*(?<alignment>[0123]*))?\s*,\s*"(?<data>.*)"/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					type: '',
					height: 0,
					human_readable: 0,
					rotation: 0,
					narrow: 2,
					wide: 2,
					alignment: 0,
					data: '',
				}
			)

			if (res.type.toUpperCase() === 'EAN13') {
				obj.code_type = 'ean13'
				obj.data = '978020137962'
			} else if (res.type.match(/128/)) {
				obj.code_type = 'code128'
				obj.data = 'barcode046037210206'
			} else {
				throw new Error('Найдена ошибка в типе barcode')
			}

			obj.pos_x = parseInt(res.pos_x, 10) / storeTemplate.dpi //0
			obj.pos_y = parseInt(res.pos_y, 10) / storeTemplate.dpi //1
			obj.height = parseInt(res.height, 10) / storeTemplate.dpi //3
			obj.human_readable = parseInt(res.human_readable, 10)
			obj.rotation = parseInt(res.rotation, 10) //5
			obj.width = parseInt(res.wide, 10) //7

			obj.data = res.data

			storeTemplate.addObject(obj)
		},
		parseQRCODE(str: string) {
			const obj = genObj({
				name: 'qrcode',
				type: 'barcode',
				code_type: 'qrcode',
				width: 10,
				height: 10,
				data: 'barcode046037210206',
			})

			const res = regParse(
				/(?:QRCODE)?\s*(?<pos_x>-?[0-9]*)\s*,\s*(?<pos_y>-?[0-9]*)\s*,\s*(?<level>[LMQH]*)\s*,\s*(?<cell>[0-9]*)\s*,\s*(?<mode>[AM]*)\s*,\s*(?<rotation>[0-9]*)(?:\s*,\s*(?<model>M[0123]*))?(?:\s*,\s*(?<mask>[sS][012345678]*))?\s*,\s*"(?<data>.*)"/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					level: 'M',
					cell: 6,
					mode: 'A',
					rotation: 0,
					model: 'M1',
					mask: 'S7',
				}
			)

			obj.pos_x = parseInt(res.pos_x, 10) / storeTemplate.dpi
			obj.pos_y = parseInt(res.pos_y, 10) / storeTemplate.dpi
			obj.width = parseInt(res.cell, 10) + 4
			obj.height = obj.width

			obj.rotation = parseInt(res.rotation, 10)

			obj.data = res.data

			storeTemplate.addObject(obj)
		},
		parsePUTBMP(str: string) {
			const obj = genObj({
				name: 'img',
				type: 'img',
				data: '',
				width: 10,
				height: 10,
				image_id: storeImages.id,
			})

			const res = regParse(
				/(?:PUTBMP)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*"(?<data>.*)"(?:\s*,\s*(?<bpp>[0-9]*))?(?:\s*,\s*(?<contract>[0-9]*))?/,
				str,
				{
					pos_x: 0,
					pos_y: 0,
					data: '',
				}
			)

			obj.pos_x = round(parseInt(res.pos_x, 10) / storeTemplate.dpi)
			obj.pos_y = round(parseInt(res.pos_y, 10) / storeTemplate.dpi)

			let image
			if ((image = storeImages.findByTagImages(res.data))) {
				obj.image_id = image.id
			} else if ((image = storeImages.findByName(res.data))) {
				obj.image_id = image.id
			} else if ((image = storeImages.findById(res.data))) {
				obj.image_id = image.id
			} else {
				serviceNotifications.alert(
					'Изображение не загружено, пожалуйста, передобавьте его вручную.'
				)
			}

			storeTemplate.addObject(obj)
		},
		parseBOX(str: string) {
			const obj = genObj({
				name: 'Бокс',
				typej: 'box',
			})

			const res = regParse(
				/(?:BOX)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<x_end>[0-9]*)\s*,\s*(?<y_end>[0-9]*)\s*,\s*(?<line_thickness>[0-9]*)\s*(?:,\s*(?<radius>[0-9]*))?/,
				str,
				{ pos_x: 0, pos_y: 0, x_end: 0, y_end: 0, line_thickness: 1, radius: 0 }
			)

			console.log(res)

			obj.pos_x = round(parseInt(res.pos_x, 10) / storeTemplate.dpi)
			obj.pos_y = round(parseInt(res.pos_y, 10) / storeTemplate.dpi)
			obj.width = round(
				Math.abs(parseInt(res.pos_x, 10) - parseInt(res.x_end, 10)) /
					storeTemplate.dpi
			)
			obj.height = round(
				Math.abs(parseInt(res.pos_y, 10) - parseInt(res.y_end, 10)) /
					storeTemplate.dpi
			)
			obj.line_thickness = round(
				parseInt(res.line_thickness, 10) / storeTemplate.dpi
			)
			obj.radius = parseInt(res.radius ?? 0, 10)

			console.log(obj)

			storeTemplate.addObject(obj)
		},
		parseBAR(str: string) {
			const obj = genObj({
				name: 'Линия',
				type: 'lines',
			})

			const res = regParse(
				/(?:BAR)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<width>[0-9]*)\s*,\s*(?<height>[0-9]*)/,
				str,
				{ pos_x: 0, pos_y: 0, width: 0, height: 0 }
			)

			obj.pos_x = round(parseInt(res.pos_x, 10) / storeTemplate.dpi)
			obj.pos_y = round(parseInt(res.pos_y, 10) / storeTemplate.dpi)
			obj.width = obj.pos_x + round(parseInt(res.width, 10) / storeTemplate.dpi)
			obj.height = obj.pos_y
			obj.line_thickness = round(parseInt(res.height, 10) / storeTemplate.dpi)

			storeTemplate.addObject(obj)
		},
	}

	const ezplParser = {
		test(str: string) {
			return /\^Q/.test(str)
		},
		parse(str: string) {
			const arr = str
				.trim()
				.split('^')
				.map(v => String(v).trim())
			arr.shift()
			let i = 0
			const count = arr.length
			const unprocessed = []
			while (i < count) {
				if (/^Q/.test(arr[i])) {
					let s = parseSplit(arr[i].replace(/^Q/, ''))
					s[0] && storeTemplate.changeHeight(parseInt(s[0], 10))
					s[1] && storeTemplate.changeGap(parseInt(s[1], 10))
				} else if (/^H/.test(arr[i])) {
					storeTemplate.changeHeight(parseInt(arr[i].replace(/^H/, ''), 10))
				} else if (/^W/.test(arr[i])) {
					storeTemplate.changeWidth(parseInt(arr[i].replace(/^W/, ''), 10))
				} else if (/^R/.test(arr[i])) {
					storeTemplate.changeRefX(parseInt(arr[i].replace(/^R/, ''), 10))
				} else if (/^L/.test(arr[i])) {
					this.parseContent(arr[i].replace(/^L/, ''))
				} else {
					unprocessed.push(arr[i])
				} //*/
				i++
			} //*/
			setUnprocessed(v => ({ ...v, unprocessedKey: unprocessed }))
		},

		parseContent(str: string) {
			const lines = str
				.trim()
				.split(/\n/)
				.map(v => String(v).trim())
			const count = lines.length
			let i = 0
			const unprocessed = []
			while (i < count) {
				let obj = genObj()
				let e = false
				if (/^AT.?,/.test(lines[i])) {
					this.textElement(obj, lines[i].replace(/^AT/, ''))
					e = true
				} else if (/^XRB/.test(lines[i])) {
					this.datamatrixElement(
						obj,
						lines[i].replace(/^XRB/, ''),
						lines[i + 1]
					)
					i++
					e = true
				} else if (/^W/.test(lines[i])) {
					this.qrcodeElement(obj, lines[i].replace(/^W/, ''), lines[i + 1])
					i++
					e = true
				} else if (/^Y/.test(lines[i])) {
					this.putbmpElement(obj, lines[i].replace(/^Y/, ''))
					e = true
				} else if (/^BE/.test(lines[i])) {
					this.barcodeElementEAN13(obj, lines[i].replace(/^BE/, ''))
					e = true
				} else if (/^BQ/.test(lines[i])) {
					this.barcodeElementCode128(obj, lines[i].replace(/^BQ/, ''))
					e = true
				} else if (/^L/.test(lines[i])) {
					this.barElement(obj, lines[i].replace(/^L/, ''))
					e = true
				} else {
					unprocessed.push(lines[i])
				}
				if (e) {
					storeTemplate.addObject(obj)
				}
				i++
			} //*/
			setUnprocessed(v => ({ ...v, unprocessedBody: unprocessed }))
		},
		textElement(obj: Record<string, any>, str: string) {
			obj.name = 'text'
			obj.typeObj = 'text'
			obj.width = 'fit-content'
			obj.height = 'fit-content'
			obj.font_id = storeFonts.id

			const arr = parseSplit(str)

			obj.pos_x = arr[1] / storeTemplate.dpi
			obj.pos_y = arr[2] / storeTemplate.dpi
			obj.rotation = arr[6]
			obj.data = arr[9]
		},
		datamatrixElement(obj: Record<string, any>, str: string, body: string) {
			obj.name = storeDataMatrix.fakeBodyDM
			obj.type = 'barcode'
			obj.code_type = 'datamatrix'
			const arr = parseSplit(str)

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.width = parseInt(arr[2].replace(/[^\d]/, ''), 10)
			obj.height = obj.width
			obj.rotation = parseInt(arr[3].replace(/[^\d]/, ''), 10)

			obj.data = body
		},
		putbmpElement(obj: Record<string, any>, str: string) {
			obj.name = 'img'
			obj.type = 'img'
			obj.width = 10
			obj.height = 10

			const arr = str.split(',').map(v => String(v).trim())

			obj.pos_x = (parseInt(arr[0], 10) * storeTemplate.mm) / storeTemplate.dpi
			obj.pos_y = (parseInt(arr[1], 10) * storeTemplate.mm) / storeTemplate.dpi

			serviceNotifications.alert(
				'Изображение не загружено, пожалуйста, передобавьте его вручную.'
			)
		},
		barElement(obj: Record<string, any>, str: string) {
			obj.name = 'Линия'
			obj.type = 'lines'
			obj.rotation = 0

			const arr = parseSplit(str)

			const p1 = [
				parseInt(arr[1], 10) / storeTemplate.dpi,
				parseInt(arr[2], 10) / storeTemplate.dpi,
			]
			const p2 = [
				parseInt(arr[4], 10) / storeTemplate.dpi,
				parseInt(arr[5], 10) / storeTemplate.dpi,
			]

			obj.pos_x = Math.min(p1[0], p2[0])
			obj.pos_y = Math.min(p1[1], p2[1])

			const x = Math.max(p1[0], p2[0])
			const y = Math.max(p1[1], p2[1])

			const dx = Math.abs(x - obj.x)
			const dy = Math.abs(y - obj.y)

			obj.width =
				y === 0 || dy === 0 ? dx : parseInt(arr[3], 10) / storeTemplate.dpi
			obj.height =
				x === 0 || dx === 0 ? dy : parseInt(arr[3], 10) / storeTemplate.dpi
		},
		barcodeElement(obj: Record<string, any>, str: string, type: string) {
			const arr = parseSplit(str)

			obj.pos_x = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[2], 10) / storeTemplate.dpi

			obj.width = parseInt(arr[4], 10)
			obj.height = parseInt(arr[5], 10) / storeTemplate.dpi

			obj.human_readable = parseInt(arr[7], 10)
			obj.human_readable =
				obj.human_readable === 1 || obj.human_readable === 2
					? 1
					: obj.human_readable === 3 || obj.human_readable === 4
					? 2
					: obj.human_readable === 5 || obj.human_readable === 6
					? 3
					: 0

			obj.rotation = parseInt(arr[6], 10)
			obj.data = arr[8]
		},
		barcodeElementEAN13(obj: Record<string, any>, str: string) {
			obj.name = 'barcode'
			obj.type = 'barcode'
			obj.code_type = 'ean13'
			obj.data = '978020137962'
			this.barcodeElement(obj, str, 'EAN13')
		},
		barcodeElementCode128(obj: Record<string, any>, str: string) {
			obj.name = 'barcode'
			obj.type = 'barcode'
			obj.code_type = 'code128'
			obj.data = 'barcode046037210206'
			this.barcodeElement(obj, str, '128')
		},
		qrcodeElement(obj: Record<string, any>, str: string, body: string) {
			obj.name = 'qrcode'
			obj.type = 'barcode'
			obj.code_type = 'qrcode'
			obj.width = 10
			obj.height = 10

			const arr = parseSplit(str)

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.rotation = parseInt(arr[8], 10)

			obj.data = body
		},
	}

	const handleParse = () => {
		if (refText.current.value < 10) {
			return
		}
		storeTemplate.clear()
		try {
			if (ezplParser.test(refText.current.value)) {
				ezplParser.parse(refText.current.value)
			} else if (tsplParser.test(refText.current.value)) {
				tsplParser.parse(refText.current.value)
			}
			storeTemplate.loadObjects(storeTemplate.objects)
			ctx.setImportFlag(false)
		} catch (e) {
			console.error(e)
			serviceNotifications.error(e.message)
		}
	}

	return (
		<Modal
			opened={ctx.importFlag}
			onClose={() => ctx.setImportFlag(false)}
			title='Импорт кода по строкам'
			size='xl'
		>
			<Stack gap='sm'>
				<Title order={6}>
					<div>Необработанные ключи: {unprocessedKey.join(' ')}</div>
					<div>Необработанное тело: {unprocessedBody.join(' ')}</div>
				</Title>
				<Textarea rows={20} ref={refText} />

				<Group gap='sm'>
					<Button variant='filled' onClick={handleParse}>
						Импорт
					</Button>
					<Button variant='filled' onClick={() => ctx.setImportFlag(false)}>
						Закрыть
					</Button>
					<FileButton onChange={handleFile} accept='.txt'>
						{props => (
							<Button {...props} variant='filled'>
								Загрузить из файла (.txt)
							</Button>
						)}
					</FileButton>
				</Group>
			</Stack>
		</Modal>
	)
})

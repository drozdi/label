import { storeApp } from '../../../entites/app/store'
import { storeDataMatrix } from '../../../entites/data-matrix/store'
import { storeFonts } from '../../../entites/fonts/store'
import { storeImages } from '../../../entites/images/store'
import { storeTemplate } from '../../../entites/template/store'
import { serviceNotifications } from '../../../services/notifications/service'
import { KEY_API_HOST, URL_API } from '../../../shared/constants'
import { round } from '../../../shared/utils'
import { genObj, parseSplit, regParse } from './base'

const _cost = (localStorage.getItem(KEY_API_HOST) || URL_API) === URL_API

export const tsplParser = {
	test(str: string) {
		return true
	},
	parse(str: string, dpi: number) {
		const lines = str
			.trim()
			.split(/\n/)
			.map(v => String(v).trim())
		lines.forEach(line => this.parseLine(line, dpi))
	},
	parseLine(line: string, dpi: number) {
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
			const reg = new RegExp(`^${v}\\s{1,}`)
			if (reg.test(line)) {
				this[`parse${v}`]?.(line.replace(reg, ''), dpi)
			}
		})
	},
	parseDIRECTION(str: string, dpi: number) {
		const [x, y] = parseSplit(str).map(v => parseInt(v.trim()))
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
	},
	parseSIZE(str: string, dpi: number) {
		const [w, h] = parseSplit(str).map(v => parseInt(v))
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
	},
	parseGAP(str: string, dpi: number) {
		const [gap] = parseSplit(str).map(v => parseInt(v))

		if (gap < 0 || gap > 30) {
			throw new Error(`Неверное значение gap.`)
		}
		storeTemplate.changeGap(gap)
	},
	parseREFERENCE(str: string, dpi: number) {
		const [x, y] = parseSplit(str).map(v => parseInt(v))
		storeTemplate.changeRefX(x)
		storeTemplate.changeRefY(y)
	},
	parseDMATRIX(str: string, dpi: number) {
		storeApp?.setDataMatrixFlag(true)
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

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)
		obj.width = round(Number(res.width) / dpi)
		obj.height = round(Number(res.height) / dpi)

		if (res.x) {
			obj.width = Number(res.x)
		} else {
			obj.width = 6
		}
		if (res.r) {
			obj.rotation = Number(res.r) || 0
		}
		// if (res.row) {
		// 	obj.width = Number(res.row)
		// }
		if (res.col) {
			obj.height = Number(res.col)
		}

		obj.data = res.data

		const dm = storeDataMatrix._selectedDM(storeDataMatrix.findByDM(obj.name))

		obj.radius = dm.size / dpi
		obj.height = obj.width

		storeTemplate.addObject(obj)
		if (!storeTemplate.isOne()) {
			storeTemplate.setActiveObject(obj.id)
		}
	},
	parseTEXT(str: string, dpi: number) {
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

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)

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

		obj.rotation = Number(res.rotation)

		if (obj.rotation === 90 || obj.rotation === 270) {
			obj.font_size = Number(res.y_multiplication)
		} else {
			obj.font_size = Number(res.x_multiplication)
		}
		obj.font_size = Math.floor((obj.font_size * dpi) / 12)

		obj.data = res.data

		storeTemplate.addObject(obj)
	},
	parseBLOCK(str: string, dpi: number) {
		const obj = genObj({
			name: 'block',
			type: 'block',
			font_size: 12,
			font_id: storeFonts.id,
		})

		const res = regParse(
			/(?:BLOCK)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<width>[0-9]*)\s*,\s*(?<height>[0-9]*)\s*,\s*"(?<font>.*)"\s*,\s*(?<rotation>[0-9]*)\s*,\s*(?<x_multiplication>[0-9]*)\s*,\s*(?<y_multiplication>[0-9]*)(?:\s*,\s*(?<space>[0-9]*))?(?:\s*,\s*(?<alignment>[0123]))?(?:\s*,\s*(?<fit>[0-9]*))?\s*,\s*"(?<data>.*)"/,
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
				fit: 0,
			}
		)

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)

		obj.width = round(Number(res.width) / dpi)
		obj.height = round(Number(res.height) / dpi)

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

		obj.rotation = Number(res.rotation ?? 0)

		if (obj.rotation === 90 || obj.rotation === 270) {
			obj.font_size = Number(res.y_multiplication)
		} else {
			obj.font_size = Number(res.x_multiplication)
		}

		obj.font_size = Math.floor((obj.font_size * dpi) / 12)

		obj.text_align = Number(res.alignment ?? 0)
		obj.data = res.data

		storeTemplate.addObject(obj)
	},
	parseBARCODE(str: string, dpi: number) {
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

		obj.pos_x = Number(res.pos_x) / dpi //0
		obj.pos_y = Number(res.pos_y) / dpi //1
		obj.height = Number(res.height) / dpi //3
		obj.human_readable = Number(res.human_readable)
		obj.rotation = Number(res.rotation) //5
		obj.width = Number(res.wide) //7

		obj.data = res.data

		storeTemplate.addObject(obj)
	},
	parseQRCODE(str: string, dpi: number) {
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

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)
		obj.width = round(Number(res.cell) + 4)
		obj.height = obj.width

		obj.rotation = Number(res.rotation)

		obj.data = res.data

		storeTemplate.addObject(obj)
	},
	parsePUTBMP(str: string, dpi: number) {
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

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)

		let image
		if ((image = storeImages.findByTagImages(res.data))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findByName(res.data))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findById(res.data))) {
			obj.image_id = image.id
		} else {
			serviceNotifications.alert('Изображение не загружено, пожалуйста, передобавьте его вручную.')
		}

		storeTemplate.addObject(obj)
	},
	parseBOX(str: string, dpi: number) {
		const obj = genObj({
			name: 'Бокс',
			typej: 'box',
		})

		const res = regParse(
			/(?:BOX)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<x_end>[0-9]*)\s*,\s*(?<y_end>[0-9]*)\s*,\s*(?<line_thickness>[0-9]*)\s*(?:,\s*(?<radius>[0-9]*))?/,
			str,
			{ pos_x: 0, pos_y: 0, x_end: 0, y_end: 0, line_thickness: 1, radius: 0 }
		)

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)
		obj.width = round(Math.abs(Number(res.pos_x) - Number(res.x_end)) / dpi)
		obj.height = round(Math.abs(Number(res.pos_y) - Number(res.y_end)) / dpi)
		obj.line_thickness = round(Number(res.line_thickness) / dpi)
		obj.radius = Number(res.radius ?? 0, 10)

		storeTemplate.addObject(obj)
	},
	parseBAR(str: string, dpi: number) {
		const obj = genObj({
			name: 'Линия',
			type: 'lines',
		})

		const res = regParse(
			/(?:BAR)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<width>[0-9]*)\s*,\s*(?<height>[0-9]*)/,
			str,
			{ pos_x: 0, pos_y: 0, width: 0, height: 0 }
		)

		obj.pos_x = round(Number(res.pos_x) / dpi)
		obj.pos_y = round(Number(res.pos_y) / dpi)
		obj.width = obj.pos_x + round(Number(res.width) / dpi)
		obj.height = obj.pos_y
		obj.line_thickness = round(Number(res.height) / dpi)

		storeTemplate.addObject(obj)
	},
}

import { storeDataMatrix } from '../../../entites/data-matrix/store'
import { storeFonts } from '../../../entites/fonts/store'
import { storeImages } from '../../../entites/images/store'
import { storeTemplate } from '../../../entites/template/store'
import { serviceNotifications } from '../../../services/notifications/service'
import { useFakeVariables } from '../../../shared/hooks'
import { round } from '../../../shared/utils'
import { genObj, regParse } from './base'

export const zplParser = {
	fontSize: 12,
	_back: undefined,
	back(fn?: Function) {
		this._back?.()
		this._back = fn
	},
	buildRegPath(key: string, paths: string[], options: Record<string, any> = {}): string {
		const opts: Record<string, any> = {
			required: true,
			...options,
		}
		return (
			`(?<${key.toLowerCase().replace(/[^a-z]/g, '')}>${opts.required ? '' : '(:?'}\\\^${key}${opts.required ? '' : ')?'}${paths.length > 1 ? '(?:' : ''}` +
			paths
				.map(path => {
					return `(?<${path}>[${(opts?.[path] ?? (paths.length > 1 ? '\^,' : '') + '\^\\\^') + ']*'})`
				})
				.join(')?(?:,') +
			'' +
			(paths.length > 1 ? ')?)' : ')')
		)
	},
	buildRegStr(...args: any[]): string {
		return args.join('') + '(?:\\\^FS)?'
	},
	test(str: string): boolean {
		return /\^XA/.test(str) && /\^XZ/.test(str)
	},
	parse(str: string, dpi: number) {
		this.fontSize = 12
		str = str.replace(/^\^XA/, '').replace(/\^XZ$/, '').replace('^CI28', '').trim()
		const lines = str
			.split('\n')
			.map(item => item.trim())
			.filter(item => item)
		lines.forEach(line => {
			if (/\^GB/.test(line)) {
				this.parseGB(line, dpi)
			} else if (/\^XG/.test(line)) {
				this.parseXG(line, dpi)
			} else if (/\^BQ/.test(line)) {
				this.parseBQ(line, dpi)
			} else if (/\^BX/.test(line)) {
				this.parseBX(line, dpi)
			} else if (/\^BE/.test(line)) {
				this.parseBE(line, dpi)
			} else if (/\^BC/.test(line)) {
				this.parseBC(line, dpi)
			} else if (/\^FD/.test(line)) {
				this.parseText(line, dpi)
			} else if (/\^A/.test(line)) {
				this.changeA(line, dpi)
			} else if (/\^CF/.test(line)) {
				this.changeСF(line, dpi)
			}
		})
	},
	changeA(str: string, dpi: number) {
		const res = regParse(new RegExp(this.buildRegPath('A', ['a_f', 'a_h', 'a_w', 'a_ff'])), str, {})
		const oldFontSize = this.fontSize
		this.back(() => {
			this.fontSize = oldFontSize
		})
		this.fontSize = Number(res.a_h)
		this.fontSize = Math.round((this.fontSize * 82) / (dpi * 25) - 1)
	},
	changeСF(str: string, dpi: number) {
		const res = regParse(new RegExp(this.buildRegPath('CF', ['cf_f', 'cf_h', 'cf_w'])), str, {})
		this.fontSize = Number(res.cf_h)
		this.fontSize = Math.round((this.fontSize * 82) / (dpi * 25) - 1)
	},
	parseText(str: string, dpi: number) {
		const obj = genObj({
			name: 'text',
			type: 'text',
			width: 'fit-content',
			height: 'fit-content',
			font_size: this.fontSize,
			font_id: storeFonts.id,
		})
		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath(
						'FB',
						['fb_maxWidth', 'fb_maxLines', 'fb_lineSpacing', 'fb_alignment', 'fb_hangingIndent'],
						{
							required: false,
						}
					),
					this.buildRegPath('A@', ['a_orientation', 'a_height', 'a_width', 'a_path'], {
						required: false,
						a_orientation: 'NIRL',
					}),
					this.buildRegPath('FD', ['fd_data'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				fb_maxWidth: 0,
				fb_maxLines: 1,
				fb_lineSpacing: 0,
				fb_alignment: 'L',
				fb_hangingIndent: 0,
				a_orientation: 'N',
				a_height: 0,
				a_width: 0,
				a_path: '',
				fd_data: '',
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		obj.data = res.fd_data.replace('\\&', '\n')

		if (res.a) {
			obj.rotation =
				res.a_orientation === 'R' ? 90 : res.a_orientation === 'I' ? 180 : res.a_orientation === 'L' ? 270 : 0

			let font_name = res.a_path.split(':')?.[1]
			let font
			if ((font = storeFonts.findByTagFonts(font_name))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findByName(font_name))) {
				obj.font_id = font.id
			} else if ((font = storeFonts.findById(font_name))) {
				obj.font_id = font.id
			} else {
				serviceNotifications.alert(
					'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
				)
			}

			if (obj.rotation === 90 || obj.rotation === 270) {
				obj.font_size = Number(res.a_height)
			} else {
				obj.font_size = Number(res.a_width)
			}

			obj.font_size = Math.floor((obj.font_size * 82) / (dpi * 25.4) - 1)
		}
		if (res.fb) {
			obj.name = 'text'
			obj.type = 'block'

			obj.width = round(Number(res.fb_maxWidth) / dpi)
			obj.height = round(((Number(res.fb_maxLines) * obj.font_size) / 72) * 25.4)

			obj.text_align = res.fb_alignment === 'R' ? 3 : res.fb_alignment === 'C' ? 2 : 1
		}
		storeTemplate.addObject(obj)
		this.back()
	},
	parseGB(str: string, dpi: number) {
		const obj = genObj({
			name: 'Бокс',
			type: 'box',
		})

		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath('GB', ['gb_width', 'gb_height', 'gb_thickness', 'gb_color', 'gb_rounding'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				gb_width: 0,
				gb_height: 0,
				gb_thickness: 1,
				gb_color: 'B',
				gb_rounding: 0,
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		if (res.gb_color === undefined && res.gb_rounding === undefined) {
			obj.name = 'Линия'
			obj.type = 'lines'

			obj.width = obj.pos_x + round(Number(res.gb_width) / dpi)
			obj.height = obj.pos_y
			obj.line_thickness = round(Number(res.gb_thickness) / dpi)
		} else {
			obj.width = round(Number(res.gb_width) / dpi)
			obj.height = round(Number(res.gb_height) / dpi)
			obj.line_thickness = round(Number(res.gb_thickness) / dpi)
			obj.radius = round(res.gb_rounding * Math.min(res.gb_width, res.gb_height))
		}

		storeTemplate.addObject(obj)
	},
	parseXG(str: string, dpi: number) {
		const obj = genObj({
			name: 'img',
			type: 'img',
			data: '',
			width: 10,
			height: 10,
			image_id: storeImages.id,
		})

		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath('XG', ['xg_path', 'xg_magnificationX', 'xg_magnificationY'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				xg_path: 0,
				xg_magnificationX: 1,
				xg_magnificationY: 1,
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		let image_name = res.xg_path.split(':')?.[1].split('.')?.[0]

		let image
		if ((image = storeImages.findByTagImages(image_name + '.BMP'))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findByName(image_name))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findById(image_name))) {
			obj.image_id = image.id
		} else {
			serviceNotifications.alert('Изображение не загружено, пожалуйста, передобавьте его вручную.')
		}

		storeTemplate.addObject(obj)
	},
	parseBQ(str: string, dpi: number) {
		const obj = genObj({
			name: 'qrcode',
			type: 'barcode',
			code_type: 'qrcode',
			width: 10,
			height: 10,
			data: 'barcode046037210206',
		})
		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath('BQ', ['bg_orientation', 'bg_model', 'bg_magnification', 'bg_errorCorrection', 'bg_mask'], {
						bg_orientation: 'NIRL',
					}),
					this.buildRegPath('FD', ['fd_data'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				bg_orientation: 'N',
				bg_model: 2,
				bg_magnification: 1,
				bg_errorCorrection: 'Q',
				bg_mask: 7,
				fd_data: '',
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		obj.rotation =
			res.bg_orientation === 'R' ? 90 : res.bg_orientation === 'I' ? 180 : res.bg_orientation === 'L' ? 270 : 0

		obj.width = round(Number(res.bg_magnification) / 0.6)
		obj.height = obj.width

		obj.data = res.fd_data

		storeTemplate.addObject(obj)
	},
	parseBX(str: string, dpi: number) {
		const obj = genObj({
			name: storeDataMatrix.fakeBodyDM,
			type: 'barcode',
			code_type: 'datamatrix',
			radius: 1.8333333333333333,
			temp: true,
			width: 6,
		})

		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath(
						'BX',
						[
							'bx_orientation',
							'bx_height',
							'bx_quality',
							'bx_columns',
							'bx_rows',
							'bx_format',
							'bx_escape',
							'bx_ratio',
						],
						{
							bx_orientation: 'NIRL',
						}
					),
					this.buildRegPath('FD', ['fd_data'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				bx_orientation: 'N',
				bx_height: 1,
				bx_quality: 200,
				bx_columns: 1,
				bx_rows: 1,
				bx_format: 6,
				bx_escape: '~',
				bx_ratio: 1,
				fd_data: '',
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		obj.rotation =
			res.bx_orientation === 'R' ? 90 : res.bx_orientation === 'I' ? 180 : res.bx_orientation === 'L' ? 270 : 0

		obj.width = Number(res.bx_height)
		obj.height = obj.width

		obj.data = res.fd_data

		if (!useFakeVariables().checkVarible(res.fd_data)) {
			obj.name = res.fd_data
		}
		let dm = storeDataMatrix?.findByDM(obj.name)
		if (dm) {
			dm = storeDataMatrix?._selectedDM(dm)
			if (dm) {
				obj.radius = dm.size / dpi
			}
		}

		storeTemplate.addObject(obj)

		if (!storeTemplate.isOne()) {
			storeTemplate.setActiveObject(obj.id)
		}
	},
	parseBE(str: string, dpi: number) {
		const obj = genObj({
			name: 'EAN 13',
			type: 'barcode',
			code_type: 'ean13',
			width: 2,
		})

		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath('BE', ['be_orientation', 'be_height', 'be_line', 'be_lineAbove'], {
						be_orientation: 'NIRL',
					}),
					this.buildRegPath('FD', ['fd_data'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				be_orientation: 'N',
				be_height: 1,
				be_line: 'Y',
				be_lineAbove: 'N',
				fd_data: '',
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		obj.rotation =
			res.be_orientation === 'R' ? 90 : res.be_orientation === 'I' ? 180 : res.be_orientation === 'L' ? 270 : 0

		obj.height = round(Number(res.be_height) / dpi)

		obj.human_readable = res.be_line === 'Y' ? 2 : 0

		obj.data = res.fd_data

		storeTemplate.addObject(obj)
	},
	parseBC(str: string, dpi: number) {
		const obj = genObj({
			name: 'CODE 128',
			type: 'barcode',
			code_type: 'code128',
			width: 2,
		})

		const res = regParse(
			new RegExp(
				this.buildRegStr(
					this.buildRegPath('FO', ['fo_x', 'fo_y', 'fo_alignment']),
					this.buildRegPath(
						'BC',
						['bc_orientation', 'bc_height', 'bc_line', 'bc_lineAbove', 'bc_checkDigit', 'bc_mode'],
						{
							bc_orientation: 'NIRL',
						}
					),
					this.buildRegPath('FD', ['fd_data'])
				)
			),
			str,
			{
				fo_x: 0,
				fo_y: 0,
				fo_alignment: 0,
				bc_orientation: 'N',
				bc_height: 10,
				bc_line: 'Y',
				bc_lineAbove: 'N',
				bc_checkDigit: 'N',
				bc_mode: 'N',
				fd_data: '',
			}
		)

		obj.pos_x = round(Number(res.fo_x) / dpi)
		obj.pos_y = round(Number(res.fo_y) / dpi)

		obj.rotation =
			res.bc_orientation === 'R' ? 90 : res.bc_orientation === 'I' ? 180 : res.bc_orientation === 'L' ? 270 : 0

		obj.height = round(Number(res.bc_height) / dpi)

		obj.human_readable = res.bc_line === 'Y' ? 2 : 0

		obj.data = res.fd_data

		storeTemplate.addObject(obj)
	},
}

import { storeDataMatrix } from '../../../entites/data-matrix/store'
import { storeFonts } from '../../../entites/fonts/store'
import { storeImages } from '../../../entites/images/store'
import { storeTemplate } from '../../../entites/template/store'
import { serviceNotifications } from '../../../services/notifications/service'
import { genObj, parseSplit, regParse } from './base'

export const ezplParser = {
	test(str: string) {
		return /\^Q/.test(str)
	},
	parse(str: string, dpi: number) {
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
			} else if (/^W/.test(arr[i])) {
				storeTemplate.changeWidth(parseInt(arr[i].replace(/^W/, ''), 10))
			} else if (/^R/.test(arr[i])) {
				storeTemplate.changeRefX(parseInt(arr[i].replace(/^R/, ''), 10))
			} else if (/^L/.test(arr[i])) {
				this.parseContent(arr[i].replace(/^L/, ''), dpi)
			} else {
				unprocessed.push(arr[i])
			} //*/
			i++
		} //*/
	},
	parseContent(str: string, dpi: number) {
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
			if (/^AT[^,]*,/.test(lines[i])) {
				this.textElement(obj, lines[i].replace(/^AT/, ''), dpi)
				e = true
			} else if (/^A[^,]*,/.test(lines[i])) {
				this.textElementS(obj, lines[i], dpi)
				e = true
			} else if (/^XRB/.test(lines[i])) {
				this.datamatrixElement(obj, lines[i].replace(/^XRB/, ''), lines[i + 1], dpi)
				i++
				e = true
			} else if (/^W/.test(lines[i])) {
				this.qrcodeElement(obj, lines[i].replace(/^W/, ''), lines[i + 1], dpi)
				i++
				e = true
			} else if (/^Y/.test(lines[i])) {
				this.putbmpElement(obj, lines[i].replace(/^Y/, ''), dpi)
				e = true
			} else if (/^BE/.test(lines[i])) {
				this.barcodeElementEAN13(obj, lines[i].replace(/^BE/, ''), dpi)
				e = true
			} else if (/^BQ/.test(lines[i])) {
				this.barcodeElementCode128(obj, lines[i].replace(/^BQ/, ''), dpi)
				e = true
			} else if (/^L/.test(lines[i])) {
				this.barElement(obj, lines[i].replace(/^L/, ''), dpi)
				e = true
			} else if (!/^E/.test(lines[i])) {
				unprocessed.push(lines[i])
			}
			if (e) {
				storeTemplate.addObject(obj)
			}
			i++
		} //*/
	},
	textElement(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'text'
		obj.type = 'text'
		obj.width = 'fit-content'
		obj.height = 'fit-content'
		obj.font_id = storeFonts.id

		const res = regParse(
			/(?:AT)?(?<t>[^,]*)?,(?<x>[0-9]*),(?<y>[0-9]*),(?<w>[0-9]*),(?<h>[0-9]*),(?<g>[0-9]*),(?<r>[0123])(?<i>[BTUELH]*)?,(?<d>[01]),(?<m>[0-9.]*),(?<data>.*)\s*/,
			str,
			{
				t: '',
				x: 0,
				y: 0,
				w: 0,
				h: 0,
				g: 0,
				r: 0,
				i: '',
				d: 0,
				m: 0,
			}
		)

		obj.pos_x = res.x / storeTemplate.dpi
		obj.pos_y = res.y / storeTemplate.dpi
		obj.rotation = res.r === '3' ? 270 : res.r === '2' ? 180 : res.r === '1' ? 90 : 0
		obj.data = res.data

		serviceNotifications.alert(
			'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
		)
	},
	textElementS(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'text'
		obj.type = 'text'
		obj.width = 'fit-content'
		obj.height = 'fit-content'
		obj.font_size = 12
		obj.font_id = storeFonts.id

		const res = regParse(
			/(?:A)?(?<t>[^,]*)?,(?<x>[0-9]*),(?<y>[0-9]*),(?<w>[0-9]*),(?<h>[0-9]*),(?<g>[0-9]*),(?<r>[01234567])(?<u>[ELH]*)?,(?<data>.*)\s*/,
			str,
			{
				t: '',
				x: 0,
				y: 0,
				w: 0,
				h: 0,
				g: 0,
				r: 0,
				m: 0,
			}
		)
		res.t = (res.t || '').toUpperCase()
		obj.font_size =
			res.t === 'A'
				? 6
				: res.t === 'B'
					? 8
					: res.t === 'C'
						? 10
						: res.t === 'D'
							? 12
							: res.t === 'E'
								? 14
								: res.t === 'F'
									? 18
									: res.t === 'G'
										? 24
										: res.t === 'H'
											? 30
											: 12

		obj.pos_x = res.x / storeTemplate.dpi
		obj.pos_y = res.y / storeTemplate.dpi
		obj.rotation =
			res.r === '3' || res.r === '7'
				? 270
				: res.r === '2' || res.r === '6'
					? 180
					: res.r === '1' || res.r === '5'
						? 90
						: 0
		obj.data = res.data

		serviceNotifications.alert(
			'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
		)
	},
	blockElement(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'text'
		obj.type = 'text'
		obj.font_id = storeFonts.id

		const res = regParse(
			/(?:AT)?(?<t>.*)?\s*,\s*(?<x>[0-9]*)\s*,\s*(?<y>[0-9]*)\s*,\s*(?<w>[0-9]*)\s*,\s*(?<h>[0-9]*)\s*,\s*(?<g>[0-9]*)\s*,\s*(?<r>[0123])(?<i>[BTUELH]*)?,\s*(?<d>[01])\s*,\s*(?<m>[0-9.]*)\s*,\s*(?<data>.*)\s*/,
			str,
			{
				t: '',
				x: 0,
				y: 0,
				w: 0,
				h: 0,
				g: 0,
				r: 0,
				i: '',
				d: 0,
				m: 0,
			}
		)

		obj.pos_x = res.x / storeTemplate.dpi
		obj.pos_y = res.y / storeTemplate.dpi
		obj.width = res.w / storeTemplate.dpi
		obj.height = res.h / storeTemplate.dpi

		obj.rotation = res.r === '3' ? 270 : res.r === '2' ? 180 : res.r === '1' ? 90 : 0

		obj.data = res.data

		serviceNotifications.alert(
			'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
		)
	},
	datamatrixElement(obj: Record<string, any>, str: string, body: string, dpi: number) {
		obj.name = storeDataMatrix.fakeBodyDM
		obj.type = 'barcode'
		obj.code_type = 'datamatrix'
		obj.temp = true
		const res = regParse(
			/(?:XRB)?(?<x>[0-9]*),(?<y>[0-9]*),(?<enlarge>[0-9]*),(?<rotation>[0123]*)[SabR]*,(?<legth>.*)[CR]*\s*(?<data>.*)?/,
			str,
			{
				x: 0,
				y: 0,
				enlarge: 0,
				rotation: 0,
				legth: 0,
				data: '',
			}
		)

		obj.pos_x = parseInt(res.x, 10) / storeTemplate.dpi
		obj.pos_y = parseInt(res.y, 10) / storeTemplate.dpi
		obj.width = parseInt(res.enlarge.replace(/[^\d]/, ''), 10)
		obj.height = obj.width
		obj.rotation = res.rotation === '3' ? 270 : res.rotation === '2' ? 180 : res.rotation === '1' ? 90 : 0

		const dm = storeDataMatrix._selectedDM(storeDataMatrix.findByDM(obj.name))

		obj.radius = dm.size / storeTemplate.dpi

		obj.data = body || res.data

		if (!storeTemplate.isOne()) {
			storeTemplate.setActiveObject(obj.id)
		}
	},
	putbmpElement(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'img'
		obj.type = 'img'

		obj.width = 10
		obj.height = 10

		const res = regParse(/(?:Y)?(?<x>[0-9]*),(?<y>[0-9]*),(?<data>.*)/, str, {})

		obj.pos_x = parseInt(res.x, 10) / storeTemplate.dpi
		obj.pos_y = parseInt(res.y, 10) / storeTemplate.dpi

		let image
		if ((image = storeImages.findByTagImages(res.data))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findByName(res.data))) {
			obj.image_id = image.id
		} else if ((image = storeImages.findById(res.data))) {
			obj.image_id = image.id
		} else {
			obj.image_id = storeImages.id
			serviceNotifications.alert('Изображение не загружено, пожалуйста, передобавьте его вручную.')
		}
	},
	barElement(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'Линия'
		obj.type = 'lines'
		obj.rotation = 0

		const res = regParse(
			/(?:L)?(?<a>[ose])?,(?<x>[0-9]*),(?<y>[0-9]*)(?:,(?<n>[0-9]*))?,(?<x1>[0-9]*),(?<y1>[0-9]*)/,
			str,
			{
				a: '',
				x: 0,
				y: 0,
				n: 0,
				x1: 0,
				y1: 0,
			}
		)

		const p1 = [parseInt(res.x, 10) / storeTemplate.dpi, parseInt(res.y, 10) / storeTemplate.dpi]
		const p2 = [parseInt(res.x1, 10) / storeTemplate.dpi, parseInt(res.y1, 10) / storeTemplate.dpi]

		obj.pos_x = Math.min(p1[0], p2[0])
		obj.pos_y = Math.min(p1[1], p2[1])

		const x = Math.max(p1[0], p2[0])
		const y = Math.max(p1[1], p2[1])

		const dx = Math.abs(x - obj.pos_x)
		const dy = Math.abs(y - obj.pos_y)

		obj.width = obj.pos_x + (y === 0 || dy === 0 ? dx : parseInt(res.n, 10) / storeTemplate.dpi)
		obj.height = obj.pos_y
		obj.line_thickness = x === 0 || dx === 0 ? dy : parseInt(res.n, 10) / storeTemplate.dpi
	},
	barcodeElement(obj: Record<string, any>, str: string, type: string, dpi: number) {
		const res = regParse(
			/(?:B)?(?<t>[^,]*),(?<x>[0-9]*),(?<y>[0-9]*),(?<narrow>[0-9]*),(?<wide>[0-9]*),(?<height>[0-9]*),(?<rotation>[0-9]*)(?<m>[BGabc]*)?,(?<readable>[0-9]*),(?<data>[^,]*)/,
			str,
			{
				t: '',
				x: 0,
				y: 0,
				narrow: 0,
				wide: 0,
				height: 0,
				rotation: '0',
				m: '',
				readable: '0',
				data: '',
			}
		)

		obj.pos_x = parseInt(res.x, 10) / storeTemplate.dpi
		obj.pos_y = parseInt(res.y, 10) / storeTemplate.dpi

		obj.width = parseInt(res.wide, 10)
		obj.height = parseInt(res.height, 10) / storeTemplate.dpi

		obj.human_readable = parseInt(res.readable, 10)
		obj.human_readable =
			res.readable === '1' || res.readable === '2'
				? 1
				: res.readable === '3' || res.readable === '4'
					? 2
					: res.readable === '5' || res.readable === '6'
						? 3
						: 0

		obj.rotation = res.rotation === '3' ? 270 : res.rotation === '2' ? 182 : res.rotation === '1' ? 90 : 0
		obj.data = res.data
	},
	barcodeElementEAN13(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'barcode'
		obj.type = 'barcode'
		obj.code_type = 'ean13'
		obj.data = '978020137962'
		this.barcodeElement(obj, str, 'EAN13', dpi)
	},
	barcodeElementCode128(obj: Record<string, any>, str: string, dpi: number) {
		obj.name = 'barcode'
		obj.type = 'barcode'
		obj.code_type = 'code128'
		obj.data = 'barcode046037210206'
		this.barcodeElement(obj, str, '128', dpi)
	},
	qrcodeElement(obj: Record<string, any>, str: string, body: string, dpi: number) {
		obj.name = 'qrcode'
		obj.type = 'barcode'
		obj.code_type = 'qrcode'
		obj.width = 10
		obj.height = 10

		const res = regParse(
			/(?:W)?(?<x>[0-9]*),(?<y>[0-9]*),(?<mode>[12345]),(?<type>[123]),(?<ec>[LMQH]),(?<mask>[0-8]),(?<mul>[0-9]*),(?<len>[0-9]*),(?<roatae>[0123])[CR]*\s*(?<data>[^,]*)/,
			str,
			{
				x: 0,
				y: 0,
				mode: '1',
				type: '1',
				ec: 'L',
				mask: '0',
				mul: '1',
				len: 0,
				roatae: 0,
				data: '',
			}
		)

		obj.pos_x = parseInt(res.x, 10) / storeTemplate.dpi
		obj.pos_y = parseInt(res.y, 10) / storeTemplate.dpi
		obj.rotation = res.roatae === '3' ? 270 : res.roatae === '2' ? 180 : res.roatae === '1' ? 90 : 0
		obj.width = parseInt(res.mul, 10) + 4
		obj.height = obj.width
		obj.data = body
	},
}

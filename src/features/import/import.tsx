import {
	Button,
	FileButton,
	Group,
	Modal,
	Stack,
	Textarea,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { serviceNotifications } from '../../entites/notifications/service'
import { storeTemplate } from '../../entites/template/store'
import { genId } from '../../shared/utils'
import { useAppContext } from '../context'

const fakeBodyDM = '0104603721020607215>(egukLfdK5r93zoJf'

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
			const arr = parseSplit(str)
			const obj = genObj({
				name: fakeBodyDM,
				type: 'barcode',
				code_type: 'datamatrix',
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.width = parseInt(arr[2], 10)
			if (/^x/.test(arr[5])) {
				obj.width = parseInt(arr[5].replace(/^x/, ''), 10)
			} else {
				obj.width = 6
			}
			if (/^r/.test(arr[6])) {
				obj.rotation = parseInt(arr[6], 10) || 0
			}

			obj.data = removeQuote(arr[8])

			obj.radius = obj.width / storeTemplate.dpi
			obj.height = obj.width

			storeTemplate.addObject(obj)
		},
		parseTEXT(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'text',
				type: 'text',
				width: 'fit-content',
				height: 'fit-content',
				font_id: storeFonts.defaultFont.id,
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			switch (parseInt(arr[2], 10)) {
				case 1:
					obj.font_size = 6
					break
				case 2:
					obj.font_size = 7
					break
				case 3:
					obj.font_size = 8
					break
				case 4:
					obj.font_size = 10
					break
				case 5:
					obj.font_size = 12
					break
				default:
					obj.font_size = 6
			}

			obj.rotation = parseInt(arr[3], 10)
			obj.data = removeQuote(arr[7] || arr[6])

			serviceNotifications.alert(
				'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
			)

			storeTemplate.addObject(obj)
		},
		parseBLOCK(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'block',
				type: 'block',
				font_id: storeFonts.defaultFont.id,
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.width = parseInt(arr[2], 10) / storeTemplate.dpi
			obj.height = parseInt(arr[3], 10) / storeTemplate.dpi
			switch (parseInt(arr[4], 10)) {
				case 1:
					obj.font_size = 6
					break
				case 2:
					obj.font_size = 7
					break
				case 3:
					obj.font_size = 8
					break
				case 4:
					obj.font_size = 10
					break
				case 5:
					obj.font_size = 12
					break
				default:
					obj.font_size = 6
			}
			obj.rotation = parseInt(arr[5], 10)
			obj.text_align = arr[8]
			obj.data = removeQuote(arr[11] || arr[10] || arr[9] || arr[8])

			serviceNotifications.alert(
				'В шаблоне будет использоваться шрифт принетра по умолчанию. Если хотите изменить шрифт в текстовом элементе, выберите нужный шрифт вручную, в свойствах элемента.'
			)

			storeTemplate.addObject(obj)
		},
		parseBARCODE(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'barcode',
				type: 'barcode',
			})
			if (str.match(/EAN13/)) {
				obj.code_type = 'ean13'
				obj.data = '978020137962'
			} else if (str.match(/128/)) {
				obj.code_type = 'code128'
				obj.data = 'barcode046037210206'
			} else {
				throw new Error('Найдена ошибка в типе barcode')
			}

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.height = parseInt(arr[3], 10) / storeTemplate.dpi
			obj.human_readable = parseInt(arr[4], 10)
			obj.rotation = parseInt(arr[5], 10)
			obj.width = parseInt(arr[6], 10)

			obj.data = removeQuote(arr[9] || arr[8])

			storeTemplate.addObject(obj)
		},
		parseQRCODE(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'qrcode',
				type: 'barcode',
				code_type: 'qrcode',
				width: 10,
				height: 10,
				data: 'barcode046037210206',
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi

			obj.rotation = parseInt(arr[5], 10)

			obj.data = removeQuote(arr[8])

			storeTemplate.addObject(obj)
		},
		parsePUTBMP(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'img',
				type: 'img',
				data: '',
				width: 10,
				height: 10,
				image_id: storeImages.defaultImage.id,
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi

			serviceNotifications.alert(
				'Изображение не загружено, пожалуйста, передобавьте его вручную.'
			)

			storeTemplate.addObject(obj)
		},
		parseBOX(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'Бокс',
				typej: 'box',
			})
			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.width =
				Math.abs(parseInt(arr[0], 10) - parseInt(arr[2], 10)) /
				storeTemplate.dpi
			obj.height =
				Math.abs(parseInt(arr[1], 10) - parseInt(arr[3], 10)) /
				storeTemplate.dpi
			obj.line_thickness = parseInt(arr[4], 10) / storeTemplate.dpi
			obj.radius = parseInt(arr[5], 10)

			storeTemplate.addObject(obj)
		},
		parseBAR(str: string) {
			const arr = parseSplit(str)
			const obj = genObj({
				name: 'Линия',
				type: 'lines',
			})

			obj.pos_x = parseInt(arr[0], 10) / storeTemplate.dpi
			obj.pos_y = parseInt(arr[1], 10) / storeTemplate.dpi
			obj.width = parseInt(arr[2], 10) / storeTemplate.dpi
			obj.height = parseInt(arr[3], 10) / storeTemplate.dpi

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
				}//*/
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
			obj.font_id = storeFonts.defaultFont?.id || 1

			const arr = parseSplit(str)

			obj.pos_x = arr[1] / storeTemplate.dpi
			obj.pos_y = arr[2] / storeTemplate.dpi
			obj.rotation = arr[6]
			obj.data = arr[9]
		},
		datamatrixElement(obj: Record<string, any>, str: string, body: string) {
			obj.name = fakeBodyDM
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

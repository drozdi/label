import { makeAutoObservable } from 'mobx'
import Fonts from '../store/Fonts'
import Memory from '../store/Memory'
import Msg from '../store/Msg'
import Object from '../store/Object'
import Templates from '../store/Templates'
import { request } from './api'
import config from './config.json'

const fakeVariable = {
	barcode: "~10103665585002190215'hX%t7Ir8FMl93dGVz",
	mandate: '30.06.2025',
	smandate: '25',
	lifetime: '36 мец',
	slifetime: '28',
	serial: '452457',
	shift: '3',
	batch: '25',
	boil: '352',
	factory: '31',
	gtin: '01234567891011',
	product: 'Название продукта',
	product0: 'Название',
	additional_text: 'Дополнительный',
	weight: '1,53',
	weight_g: '1530',
	package_size: '24',
	package_size_units: '12',
	ean13: '2245245015303',
	mandate_11: '250630',
	weight_3103: '001530',
	expdate_17: '250630',
	ean13barcode: '',
	batch_10: '0000000025',
	boil_10: '0000000352',
	pack_gtin: '01234567891011',
	pack_ean13barcode: '01234567891011',
	counter: '38',
	count: '39',
	sizing_s: '1530',
	sizing_l: '1,53',
	pack_name: 'Агрегат',
	cell: '35',
}

class service {
	constructor() {
		makeAutoObservable(this)
	}
	// Переменные
	server_url = config.url_api
	images = []
	imgLoading = true
	fontsLoading = true
	templatesLoading = true
	tempImgLoading = true
	templatesListLoading = true
	errorNetwork = false
	dm_table = []

	// Получить все переменные
	getVar = async () => {
		try {
			const res = await request.get('template_list/print_variables/')
			Memory.varDateWrite(res.data)
		} catch (e) {
			console.error(e)
		}
	}

	// Получить все изображения
	getImages = async () => {
		this.imgLoading = true
		try {
			const res = await request.get(`images/`)
			if (res.data['data'].length !== 0) {
				this.images = res.data['data']['response']
				this.images.forEach(el => {
					el.data = atob(el.data)
				})
			}
		} catch (e) {
			console.error(e)
		} finally {
			this.imgLoading = false
		}
	}
	//   Загрузить изображение на сервер
	postImg = async (name, file) => {
		try {
			const res = await request.post(`images/`, {
				name: name,
				tag_images: Memory.regPost(name) + '.BMP',
				data: file,
			})
		} catch (e) {
			console.error(e)
		} finally {
			this.getImages()
		}
	}

	//   Загрузить шрифт
	postFont = async (name, file) => {
		try {
			const res = await request.post(`fonts/`, {
				name: String(name),
				tag_fonts: Memory.regPost(String(name)) + '.TTF',
				data: file,
			})
		} catch (e) {
			console.error(e)
		} finally {
			this.getFonts()
		}
	}
	// Получить все шрифты
	getFonts = async () => {
		this.fontsLoading = true
		try {
			const res = await request.get(`fonts/`)
			if (res.data.success) {
				Fonts.fonts = [...res.data['data']['response']]
				Fonts.fonts.forEach(f => {
					const myFont = new FontFace(
						f.name,
						`url(data:application/octet-stream;base64,${f.data})`
					)
					myFont.load()
					document.fonts.add(myFont)
				})
			}
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				return (this.errorNetwork = true)
			}
		} finally {
			this.getVar()
			Fonts.defaultFont(Fonts.fonts[0])
			this.fontsLoading = false
		}
	}

	//   Сохранить шаблон
	postTemplate = async obj => {
		try {
			const res = await request.post(`form_labels/`, obj)
			if (!res.data.success) {
				Memory.visiblePost(true)
			} else {
				Msg.writeMessages('Шаблон успешно сохранён')
				Templates.saveID(res.data['data'].id)
				return res.data
			}
		} catch (e) {
			console.error(e)
		}
	}
	// Получить все шаблоны
	getTemplates = async () => {
		this.templatesListLoading = true
		try {
			const res = await request.get(`template_list/`)
			if (res.data['data'].length !== 0) {
				Memory.templates = res.data['data']['response']
			} else {
				Memory.templates = []
			}
		} catch (e) {
			console.error(e)
		} finally {
			this.templatesListLoading = false
		}
	}
	// Получить шаблон по id
	getTemplatesID = async id => {
		this.templatesLoading = true
		try {
			const res = await request.get(`form_labels/${id}`)
			Templates.preview_templates = res.data['data']
			Templates.convertTemplatesForLabel()
			console.log(res.data)
			return res.data['data']
		} catch (e) {
			console.error(e)
		} finally {
			Memory.writeNameTemplate()
			this.templatesLoading = false
		}
	}
	// Обновление существующих объектов внутри шаблона
	pathUpdateObj = async obj => {
		try {
			const res = await request.patch(`form_labels/field`, obj)
			if (!res.data.success) {
				Memory.visiblePost(true)
			}
			Msg.writeMessages('Шаблон успешно изменён')
			return res.data
		} catch (e) {
			Msg.writeMessages('Не удалось изменить шаблон.')
			console.error(e, obj)
		}
	}
	// Обновление параметров этикетки
	pathUpdateLabel = async label => {
		try {
			const res = await request.patch(
				`form_labels/label/` + Templates.preview_templates.id,
				label
			)
		} catch (e) {
			console.error(e)
		}
	}
	// Удаление объекта
	deleteObj = async objects => {
		const deleteData = {
			method: 'delete',
			maxBodyLength: Infinity,
			url: 'form_labels/field',
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id_fields: objects },
		}
		try {
			const res = await request(deleteData)
		} catch (e) {
			console.error(e)
		}
	}
	// Добавить объект в существующий шаблон
	addNewObj = async objects => {
		const newObj = {
			template_id: Templates.preview_templates.id,
			object: objects,
		}
		try {
			const res = await request.post('template_fields', newObj)
			return res.data
		} catch (e) {
			console.error(e)
		}
	}

	// Удалить шаблон
	deleteTemplate = async () => {
		const deleteTemplate = {
			method: 'delete',
			maxBodyLength: Infinity,
			url: 'template_list',
			headers: {
				'Content-Type': 'application/json',
			},
			data: { id_label: [Templates.preview_templates.id] },
		}

		try {
			const res = await request(deleteTemplate)
		} catch (e) {
			console.error(e)
		} finally {
			this.getTemplates()
			Object.resetPreiew()
			Templates.preview_templates = []
			Templates.downloaded_template = []
		}
	}

	// Получить таблицу размеров DM
	getSizeDM = async () => {
		try {
			const res = await request('template_list/dm')
			this.dm_table = res.data['data']
		} catch (e) {
			console.error(e)
		}
	}

	trialPrint = async () => {
		const ping = await this.pingPrinter(true)
		if (ping !== 'Готов к работе') return
		try {
			const res = await request.post(`trial_printing`, {
				template: {
					id_template: Templates.template_id,
					is_update: true,
				},
				setting_printer: {
					host: JSON.parse(localStorage.getItem('printer')).host,
					port: Number(JSON.parse(localStorage.getItem('printer')).port),
					type_printer: JSON.parse(localStorage.getItem('printer'))
						.type_printer,
					number_labels: Number(JSON.parse(localStorage.getItem('printer')))
						.number_labels,
					printer_resolution: Number(
						JSON.parse(localStorage.getItem('printer')).printer_resolution
					),
				},
			})
			Templates.setCodeTypeTemplate(res.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			if (e.code === 'ERR_NETWORK') {
				Msg.writeMessages(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
			console.error(e)
		}
	}
	codePrint = async () => {
		const ping = await this.pingPrinter(true)
		if (ping !== 'Готов к работе') return
		try {
			const res = await request.post(`printing/str_template`, {
				template: {
					id_template: Templates.template_id,
					is_update: true,
				},
				setting_printer: {
					host: JSON.parse(localStorage.getItem('printer')).host,
					port: Number(JSON.parse(localStorage.getItem('printer')).port),
					type_printer: JSON.parse(localStorage.getItem('printer'))
						.type_printer,
					number_labels: Number(JSON.parse(localStorage.getItem('printer')))
						.number_labels,
					printer_resolution: Number(
						JSON.parse(localStorage.getItem('printer')).printer_resolution
					),
				},
			})
			Templates.setCodeTypeTemplate(res.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			if (e.code === 'ERR_NETWORK') {
				Msg.writeMessages(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
			console.error(e)
		}
	}

	examplePrint = async () => {
		const ping = await this.pingPrinter(true)
		if (ping !== 'Готов к работе') return
		try {
			const resTmp = await request.post(`printing/str_template`, {
				template: {
					id_template: Templates.template_id,
					is_update: true,
				},
				setting_printer: {
					host: JSON.parse(localStorage.getItem('printer')).host,
					port: Number(JSON.parse(localStorage.getItem('printer')).port),
					type_printer: JSON.parse(localStorage.getItem('printer'))
						.type_printer,
					number_labels: Number(JSON.parse(localStorage.getItem('printer')))
						.number_labels,
					printer_resolution: Number(
						JSON.parse(localStorage.getItem('printer')).printer_resolution
					),
				},
			})

			const res = await request.post(`printing`, {
				template_str: {
					template: resTmp.data.data,
					variable: fakeVariable,
				},
				setting_printer: {
					host: JSON.parse(localStorage.getItem('printer')).host,
					port: Number(JSON.parse(localStorage.getItem('printer')).port),
					type_printer: JSON.parse(localStorage.getItem('printer'))
						.type_printer,
					number_labels: Number(JSON.parse(localStorage.getItem('printer')))
						.number_labels,
					printer_resolution: Number(
						JSON.parse(localStorage.getItem('printer')).printer_resolution
					),
				},
			})

			Templates.setCodeTypeTemplate(resTmp.data.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			if (e.code === 'ERR_NETWORK') {
				Msg.writeMessages(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
			console.error(e)
		}
	}

	pingPrinter = async trial => {
		try {
			const res = await request.post('trial_printing/ping', {
				host: JSON.parse(localStorage.getItem('printer')).host,
				port: JSON.parse(localStorage.getItem('printer')).port,
				type_printer: JSON.parse(localStorage.getItem('printer')).type_printer,
			})
			if (res.data.success) {
				if (!trial || res.data.data !== 'Готов к работе') {
					Msg.writeMessages(`Ответ от принтера. ${res.data.data}`)
				}
			} else {
				Msg.writeMessages(`Ошибка принтера. ${res.data.data}`)
			}
			return res.data.data
		} catch (e) {
			console.error(e)
			return Msg.writeMessages(
				'Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
			)
		}
	}

	getSettingsPrinter = async () => {
		try {
			const res = await request(
				`setting?host=${
					JSON.parse(localStorage.getItem('printer')).host
				}&port=${
					JSON.parse(localStorage.getItem('printer')).port
				}&type_printer=${
					JSON.parse(localStorage.getItem('printer')).type_printer
				}`
			)
			return res.data['data']
		} catch (e) {
			console.error(e)
		}
	}

	setSettingsPrinter = async option => {
		try {
			const res = await request.post(`setting`, option)
			return res.data.success
		} catch (e) {
			console.error(e)
			return Msg.writeMessages(
				'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
			)
		}
	}

	// Получить юникодшаблона
	exportCodeTemplate = async id => {
		try {
			const res = await request(`trial_printing/get_template/${id}`)
			console.log(res.data)
			return res.data
		} catch (e) {
			console.error(e)
		}
	}

	importCodeTemplate = async data => {
		try {
			const res = await request.post(`trial_printing/save_template`, {
				data: data,
			})
			if (res.data.success) {
				Msg.writeMessages(
					`Файл импортирован успешно! Добавлен в список под именем - ${res.data['data'].name}`
				)
			} else {
				Msg.writeMessages(
					'Не удалось импортировать файл! Содержимое файла имеет некорректный шаблон. Выгрузите, пожалуйста, файл ещё раз из редактора этикеток DMC или DMC. Не открывайте его и не меняйте содержимое, это может привести к повторному сбою при импорте.'
				)
			}
			return res.data
		} catch (e) {
			console.error(e)
		} finally {
			this.getTemplates()
		}
	}
}

export default new service()

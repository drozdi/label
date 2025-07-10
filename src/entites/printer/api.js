import { request } from '../../request/service.config'
import { storePrinter } from './store'

class Printer {
	async ping() {
		return await request.post('trial_printing/ping', {
			host: storePrinter.host,
			port: storePrinter.port,
			type_printer: storePrinter.type_printer,
		})
	}

	async trialPrint(template) {
		return await request.post(`trial_printing`, {
			template,
			setting_printer: {
				host: storePrinter.host,
				port: storePrinter.port,
				type_printer: storePrinter.type_printer,
				number_labels: storePrinter.number_labels,
				printer_resolution: storePrinter.printer_resolution,
			},
		})
	}

	async codePrint(template) {
		return await request.post(`printing/str_template`, {
			template,
			setting_printer: {
				host: storePrinter.host,
				port: storePrinter.port,
				type_printer: storePrinter.type_printer,
				number_labels: storePrinter.number_labels,
				printer_resolution: storePrinter.printer_resolution,
			},
		})
	}

	async examplePrint(template_str) {
		return await request.post(`printing`, {
			template_str,
			setting_printer: {
				host: storePrinter.host,
				port: storePrinter.port,
				type_printer: storePrinter.type_printer,
				number_labels: storePrinter.number_labels,
				printer_resolution: storePrinter.printer_resolution,
			},
		})
	}
}

export const apiPrinter = new Printer()

/*
import { makeAutoObservable } from 'mobx'
import config from '../config.json'
import Fonts from '../store/Fonts'
import Memory from '../store/Memory'
import Msg from '../store/Msg'
import Object from '../store/Object'
import Templates from '../store/Templates'
import { request } from './service.config'

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
*/

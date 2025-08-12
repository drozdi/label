import { api } from '../../shared/api'

export async function requestPrinterPing(data: {
	host: string
	port: number
	type_printer: string
}) {
	const res = await api.post('/trial_printing/ping', data)
	return res.data
}

export async function requestPrinterSettings(params: {
	host: string
	port: string
	type_printer: string
}) {
	const res = await api.get('/setting', {
		params,
	})
	return res.data.data
}
export async function requestPrinterSettingsSave(option) {
	const res = await api.post(`/setting`, option)
	return res.data.success
}

export async function requestPrinterTrial(data: {
	template: string | number
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: string
	}
}) {
	const res = await api.post('/trial_printing', data)
	return res.data
}

export async function requestPrinterCode(data: {
	template: string | number
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: string
	}
}) {
	const res = await api.post('/printing/str_template', data)
	return res.data
}
export async function requestPrinterExample(data: {
	template_str: string
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: string
	}
}) {
	const res = await api.post('/printing/str_template', data)
	return res.data
}

/*class Printer {
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

export const apiPrinter = new Printer()*/

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
	// Получить таблицу размеров DM
	getSizeDM = async () => {
		try {
			const res = await request('template_list/dm')
			this.dm_table = res.data['data']
		} catch (e) {
			console.error(e)
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
}

export default new service()
*/

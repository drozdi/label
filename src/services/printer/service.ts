import {
	requestPrinterCode,
	requestPrinterExample,
	requestPrinterMemory,
	requestPrinterPing,
	requestPrinterSettings,
	requestPrinterSettingsSave,
	requestPrinterTrial,
} from '../../entites/printer/api'
import { storePrinter } from '../../entites/printer/store'
import { serviceNotifications } from '../notifications/service'

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
	taskid: '15',
}

class ServicePrinter {
	get settingPrinter() {
		const config = storePrinter.getConfig()
		return {
			host: config.host,
			port: config.port,
			type_printer: config.type_printer,
			number_labels: config.number_labels,
			printer_resolution: config.printer_resolution,
		}
	}
	async ping(trial = false) {
		const config = storePrinter.getConfig()
		storePrinter.setLoading(true)
		try {
			const res = await requestPrinterPing({
				host: config.host,
				port: config.port,
				type_printer: config.type_printer,
			})
			if (res.success) {
				if (!trial || res.data !== 'Готов к работе') {
					serviceNotifications.danger(`Ответ от принтера. ${res.data}`)
				}
			} else {
				serviceNotifications.error(`Ошибка принтера. ${res.data}`)
			}
			return res.data
		} catch (e) {
			console.error(e)
			serviceNotifications.error(
				'Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
			)
		} finally {
			storePrinter.setLoading(false)
		}
		return false
	}
	async getSettings() {
		const config = storePrinter.getConfig()
		return await requestPrinterSettings({
			host: config.host,
			port: config.port,
			type_printer: config.type_printer,
		})
	}
	async setSettings(data) {
		return await requestPrinterSettingsSave(data)
	}
	async codePrint(template_id) {
		const ping = await this.ping(true)
		if (!ping) {
			return
		}
		storePrinter.setLoading(true)
		try {
			const res = await requestPrinterCode({
				template: {
					id_template: template_id,
					is_update: true,
				},
				setting_printer: this.settingPrinter,
			})
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				serviceNotifications.error(
					'Шаблон не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		} finally {
			storePrinter.setLoading(false)
		}
	}
	async trialPrint(template_id) {
		const ping = await this.ping(true)
		if (!ping) return
		storePrinter.setLoading(true)
		try {
			const res = await requestPrinterTrial({
				template: {
					id_template: template_id,
					is_update: true,
				},
				setting_printer: this.settingPrinter,
			})
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				serviceNotifications.error(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		} finally {
			storePrinter.setLoading(false)
		}
	}
	async examplePrint(template_id) {
		const ping = await this.ping(true)
		if (!ping) {
			return
		}
		storePrinter.setLoading(true)
		try {
			const resTmp = await requestPrinterCode({
				template: {
					id_template: template_id,
					is_update: true,
				},
				setting_printer: this.settingPrinter,
			})

			const res = await requestPrinterExample({
				template_str: {
					template: resTmp.data,
					variable: fakeVariable,
				},
				setting_printer: this.settingPrinter,
			})
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				serviceNotifications.error(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		} finally {
			storePrinter.setLoading(false)
		}
	}
	async memory() {
		const config = storePrinter.getConfig()
		return await requestPrinterMemory({
			host: config.host,
			port: config.port,
			type_printer: config.type_printer,
		})
	}
}

export const servicePrinter = new ServicePrinter()

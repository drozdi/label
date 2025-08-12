import { serviceNotifications } from '../notifications/service'
import {
	requestPrinterPing,
	requestPrinterSettings,
	requestPrinterSettingsSave,
} from './api'
import { storePrinter } from './store'

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

class Printer {
	async ping(trial = false) {
		const config = storePrinter.getConfig()
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
		const res = await requestPrinterSettingsSave(data)
	}

	/*async trialPrint() {
		const ping = await this.pingPrinter(true)
		if (!ping) return
		try {
			const res = await apiPrinter.trialPrint({
				id_template: Templates.template_id,
				is_update: true,
			})

			Templates.setCodeTypeTemplate(res.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				storeMessage.error(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		}
	}
	async codePrint() {
		const ping = await this.ping(true)
		if (!ping) {
			return
		}
		try {
			const res = await apiPrinter.codePrint({
				id_template: Templates.template_id,
				is_update: true,
			})
			Templates.setCodeTypeTemplate(res.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				storeMessage.error(
					'Шаблон не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		}
	}
	async examplePrint() {
		const ping = await this.pingPrinter(true)
		if (!ping) return
		try {
			const resTmp = await apiPrinter.codePrint({
				id_template: Templates.template_id,
				is_update: true,
			})
			const res = await apiPrinter.examplePrint({
				template: resTmp.data.data,
				variable: fakeVariable,
			})

			Templates.setCodeTypeTemplate(resTmp.data.data)
			console.log(res.data)
			return res.data
		} catch (e) {
			console.error(e)
			if (e.code === 'ERR_NETWORK') {
				storeMessage.error(
					'Шаблон не распечатан. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует соединение с локальной сетью'
				)
			}
		}
	}*/
}

export const servicePrinter = new Printer()

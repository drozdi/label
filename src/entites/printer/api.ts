import { api } from '../../services/api'

export async function requestPrinterPing(data: { host: string; port: number; type_printer: string }) {
	const res = await api.post('/trial_printing/ping', data)
	return res.data
}

export async function requestPrinterSettings(params: { host: string; port: string; type_printer: string }) {
	const res = await api.get('/setting', {
		params,
	})
	return res.data.data
}
export async function requestPrinterSettingsSave(option) {
	const res = await api.post(`/setting`, option)
	return res.data.success
}

export async function requestPrinterCode(data: {
	template: {
		id_template: string | number
		is_update: boolean
	}
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: number
	}
}) {
	const res = await api.post('/printing/str_template', data)
	return res.data
}

export async function requestPrinterTrial(data: {
	template: {
		id_template: string | number
		is_update: boolean
	}
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: number
	}
}) {
	const res = await api.post('/trial_printing', data)
	return res.data
}

export async function requestPrinterExample(data: {
	template_str: {
		template: string
		variable: Record<string, any>
	}
	setting_printer: {
		host: string
		port: number
		type_printer: string
		number_labels: number
		printer_resolution: number
	}
}) {
	const res = await api.post('/printing', data)
	return res.data
}

export async function requestPrinterMemory(params: { host: string; port: string; type_printer: string }) {
	const res = await api.get('/printer_memory', { params })
	return res.data
}

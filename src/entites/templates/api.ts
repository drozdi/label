import { api } from '../../shared/api'

// Получить все шаблоны
export async function requestTemplateList() {
	const res = await api.get(`/template_list/`)
	return res.data.data.response
}

//   Сохранить шаблон
export async function requestTemplateSave(obj) {
	const res = await api.post(`/form_labels/`, obj)
	return res.data
}

// Обновление параметров этикетки
export async function requestTemplateUpdate(id, options) {
	const res = await api.patch(`/form_labels/label/` + id, options)
	return res.data
}

// Обновление существующих объектов внутри шаблона
export async function requestObjectUpdate(obj) {
	const res = await api.post(`/form_labels/field/`, obj)
	return res.data
}

// Получить шаблон по id
export async function requestTemplateId(id: number) {
	const res = await api.get(`/form_labels/${id}`)
	return res.data.data
}

// Получить юникодшаблона
export async function requestTemplateExportCode(id: number) {
	const res = await api.get(`/trial_printing/get_template/${id}`)
	return res.data
}

export async function requestTemplateImportCode(data) {
	const res = await api.post(`/trial_printing/save_template`, {
		data,
	})
	return res.data
}

// Удалить шаблон
export async function requestTemplateDelete(id: number | number[]) {
	const deleteTemplate = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: '/template_list',
		headers: {
			'Content-Type': 'application/json',
		},
		data: { id_label: [].concat(id as never | never[]) },
	}
	const res = await api(deleteTemplate)
}

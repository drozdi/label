import { api } from '../../services/api'

// Получить все шаблоны
export async function requestTemplateList(
	{ size, number }: IRequestTemplateList = {
		size: 100,
		number: 0,
	}
) {
	const res = await api.get(`/template_list/`, {
		params: {
			size,
			number,
		},
	})
	return res.data.data.response
}

// Получить шаблон по id
export async function requestTemplateId(id: number) {
	const res = await api.get(`/form_labels/${id}`)
	return res.data.data
}

//   Сохранить шаблон
export async function requestTemplateSave(obj) {
	const res = await api.post(`/form_labels/`, {
		...obj,
		objects: obj.objects.map(item => {
			if (item.type === 'text') {
				item.width = 0
				item.height = 0
			}
			return item
		}),
	})
	return res.data
}

// Обновление параметров этикетки
export async function requestTemplateUpdate(id, options) {
	const res = await api.patch(`/form_labels/label/` + id, options)
	return res.data
}

// Удалить шаблон
export async function requestTemplateDelete(id: number | number[]) {
	const deleteTemplate = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: '/template_list',
		data: { id_label: [].concat(id as never | never[]) },
	}
	const res = await api(deleteTemplate)
	return res.data
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

// Обновление существующих объектов внутри шаблона
export async function requestObjectNew(template_id = 0, objects: any | any[]) {
	if (template_id < 1) {
		return
	}

	const res = await api.post('/template_fields', {
		template_id,
		object: [].concat(objects).map(item => {
			if (item.type === 'text') {
				item.width = 0
				item.height = 0
			}
			return item
		}),
	})

	return res.data
}

export async function requestObjectUpdate(objects: any | any[]) {
	const res = await api.patch(
		`/form_labels/field/`,
		[].concat(objects).map(item => {
			if (item.type === 'text') {
				item.width = 0
				item.height = 0
			}
			return item
		})
	)
	return res.data
}
// Обновление существующих объектов внутри шаблона
export async function requestObjectDelete(objects: number | number[]) {
	const deleteData = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: '/form_labels/field',
		data: { id_fields: [].concat(objects) },
	}

	const res = await api(deleteData)
	return res.data
}

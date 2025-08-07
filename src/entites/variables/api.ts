import { api } from '../../shared/api'

export async function requestVariablesList() {
	const res = await api.get(`/template_list/print_variables/`)
	return res.data
}

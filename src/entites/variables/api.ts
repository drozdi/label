import { api } from '../../services/api'

export async function requestVariablesList() {
	const res = await api.get(`/template_list/print_variables/`)
	return res.data
}

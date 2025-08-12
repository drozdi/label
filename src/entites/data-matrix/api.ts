import { api } from '../../shared/api'

export async function requestDataMatrixList() {
	const res = await api.get('/template_list/dm')
	return res.data.data
}

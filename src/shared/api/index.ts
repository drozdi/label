import axios from 'axios'
import { URL_API } from '../constants'

export const api = axios.create({
	baseURL: localStorage.getItem('api.host') || URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
})
api.interceptors.request.use(config => {
	return config
})
api.interceptors.response.use(
	config => {
		return config
	},
	e => {
		throw e
	}
)

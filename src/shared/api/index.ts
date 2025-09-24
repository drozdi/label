import axios from 'axios'
import { KEY_API_HOST, URL_API } from '../constants'

export const api = axios.create({
	baseURL: localStorage.getItem(KEY_API_HOST) || URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.response.use(
	config => {
		return config
	},
	e => {
		throw e
	}
) //*/

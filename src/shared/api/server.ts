import axios from 'axios'
import { KEY_API_HOST, KEY_API_TIMEOUT, TIMEOUT_API, URL_API } from '../constants'

export const api = axios.create({
	baseURL: localStorage.getItem(KEY_API_HOST) || URL_API,
	timeout: Number(localStorage.getItem(KEY_API_TIMEOUT) || TIMEOUT_API) * 1000,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.response.use(
	config => config,
	e => {
		throw e
	}
) //*/

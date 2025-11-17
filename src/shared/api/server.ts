import axios from 'axios'
import { KEY_API_HOST, KEY_API_TIMEOUT, TIMEOUT_API, URL_API } from '../constants'
import { _log } from './log'

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
		_log(
			`api error: ${e.config.method} ${e.config.url} ${JSON.stringify(e.config.params)} | ${e.response?.status || e.status}: ${e.response?.data?.message || e.message}`
		)
		// console.log(
		// 	JSON.parse(
		// 		JSON.stringify({
		// 			...e.config,
		// 			adapter: undefined,
		// 			headers: undefined,
		// 			transitional: undefined,
		// 			transformRequest: undefined,
		// 			transformResponse: undefined,
		// 			validateStatus: undefined,
		// 			xsrfCookieName: undefined,
		// 			xsrfHeaderName: undefined,
		// 			maxBodyLength: undefined,
		// 			maxContentLength: undefined,
		// 		})
		// 	)
		// )
		throw e
	}
) //*/

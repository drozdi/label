import axios from 'axios'
import { KEY_API_HOST, URL_API } from '../constants'

export const api = axios.create({
	baseURL: localStorage.getItem(KEY_API_HOST) || URL_API,
	//withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		/*'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS', //*/
	},
})
/*
api.interceptors.request.use(config => {
	return config
})
*/
api.interceptors.response.use(
	config => {
		return config
	},
	e => {
		throw e
	}
) //*/

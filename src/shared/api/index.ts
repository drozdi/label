import axios from 'axios'
import { URL_API } from '../constants'

export const api = axios.create({
	baseURL: localStorage.getItem('api.host') || URL_API,
	//withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		/*'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',*/
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
		console.log(e)
		throw e
	}
) //*/

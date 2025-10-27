import axios from 'axios'
import dayjs from 'dayjs'

export function _log(message: string) {
	if (!import.meta.env.VITE_SERVER_LOG) {
		return
	}
	console.log(dayjs().format('YYYY-MM-DD HH:mm:ss ') + message)
	axios.post(
		import.meta.env.VITE_SERVER_LOG,
		{
			message: dayjs().format('YYYY-MM-DD HH:mm:ss ') + message,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	)
}

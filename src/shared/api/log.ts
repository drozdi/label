import dayjs from 'dayjs'

export function _log(message: string) {
	if (!import.meta.env.VITE_SERVER_LOG) {
		return
	}
	console.log(dayjs().format('YYYY-MM-DD HH:mm:ss ') + message)
}

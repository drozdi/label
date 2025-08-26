import { notifications } from '@mantine/notifications'
import { useNotifications } from '../../entites/notifications/store'
import classes from './notification.module.css'

function checkMessage(notifications, message: string) {
	if (notifications.length) {
		if (
			notifications.findIndex(
				notification => notification.message === message
			) > -1
		) {
			return false
		}
	}
	return true
}

function send(item) {
	const store = useNotifications()
	if (false === checkMessage(store.notifications, item.message)) {
		return
	}
	if (false === checkMessage(store.queue, item.message)) {
		return
	}
	console.log(classes)
	return notifications.show({
		autoClose: 10000,
		withBorder: true,
		withCloseButton: true,
		position: 'top-center',
		classNames: classes,
		...item,
	})
}

export const serviceNotifications = {
	error: message => {
		send({ message, color: 'red' })
	},
	success: message => {
		send({ message, color: 'green' })
	},
	danger: message => {
		send({ message, color: 'orange' })
	},
	alert: message => {
		send({ message })
	},
}

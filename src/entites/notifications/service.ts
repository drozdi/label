import { notifications } from '@mantine/notifications'

import classes from './Style.module.css'

function send(item) {
	notifications.cleanQueue()
	/*if (notificationsStore.notifications.length) {
		if (
			notificationsStore.notifications.findIndex(notification => {
				return notification.message === item.message
			}) > -1
		) {
			return
		}
	}*/
	return notifications.show({
		...item,
		autoClose: 10000,
		withCloseButton: true,
		position: 'top-center',
		classNames: classes,
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

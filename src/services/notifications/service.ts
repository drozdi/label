import { notifications, notificationsStore } from '@mantine/notifications'
import classes from './notification.module.css'

function checkMessage(notifications, message: string) {
	if (notifications.length) {
		if (notifications.findIndex(notification => notification.message === message) > -1) {
			return false
		}
	}
	return true
}

function send(item) {
	const store = notificationsStore.getState()
	if (false === checkMessage(store.notifications, item.message)) {
		return
	}
	if (false === checkMessage(store.queue, item.message)) {
		return
	}
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
	error: (title: string, message?: string) => {
		send({
			title: message ? title : undefined,
			message: message || title,
			color: 'red',
		})
	},
	success: (title: string, message?: string) => {
		send({
			title: message ? title : undefined,
			message: message || title,
			color: 'green',
		})
	},
	danger: (title: string, message?: string) => {
		send({
			title: message ? title : undefined,
			message: message || title,
			color: 'orange',
		})
	},
	alert: (title: string, message?: string) => {
		send({
			title: message ? title : undefined,
			message: message || title,
		})
	},
}

import { notifications } from '@mantine/notifications'
import classes from './Style.module.css'

export const serviceNotifications = {
	send(item) {
		notifications.show({
			...item,
			autoClose: 5000,
			withCloseButton: true,
			position: 'top-center',
			classNames: classes,
		})
	},
	error: message => {
		serviceNotifications.send({ message, color: 'red' })
	},
	success: message => {
		serviceNotifications.send({ message, color: 'green' })
	},
	danger: message => {
		serviceNotifications.send({ message, color: 'orange' })
	},
	alert: message => {
		serviceNotifications.send({ message })
	},
}

import { notificationsStore } from '@mantine/notifications'

export function useNotifications() {
	return notificationsStore.getState()
}

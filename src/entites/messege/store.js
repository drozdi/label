import { makeAutoObservable } from 'mobx'

class Message {
	constructor() {
		makeAutoObservable(this)
	}
	countId = 0
	messages = []
	send(message, type = '') {
		const dublicate = this.messages.find(
			m =>
				m.message ===
				message
					.replace(/[{}"']/gm, '')
					.replace(/[:]/gm, ': ')
					.replace(/,/gm, ', ')
		)
		if (!dublicate) {
			this.messages = [
				...this.messages,
				{
					type,
					id: ++this.countId,
					message: message
						.replace(/[{}"']/gm, '')
						.replace(/[:]/gm, ': ')
						.replace(/,/gm, ', '),
				},
			]
		}
	}
	clear() {
		this.messages = []
	}
	remove(id) {
		this.messages = this.messages.filter(m => m.id !== id)
	}
	error(message) {
		this.send(message, 'error')
	}
	success(message) {
		this.send(message, 'success')
	}
	danger(message) {
		this.send(message, 'danger')
	}
}

export const storeMessage = new Message()

import { request } from '../../request/service.config'
import Memory from '../../store/Memory'

class Fonts {
	async lists() {
		return await request.get(`fonts/`)
	}
	async post({ name, file }) {
		return await request.post(`fonts/`, {
			name: String(name),
			tag_fonts: Memory.regPost(String(name)) + '.TTF',
			data: file,
		})
	}
}

export const apiFonts = new Fonts()

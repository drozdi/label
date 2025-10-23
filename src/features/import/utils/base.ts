import { genId } from '../../../shared/utils'

export function genObj(def = {}) {
	return {
		id: genId(),
		name: null,
		text_align: 1,
		human_readable: 0,
		radius: 0,
		line_thickness: 0.0,
		enabled: true,
		type: null,
		pos_x: 0.0,
		pos_y: 0.0,
		width: 0.0,
		height: 0.0,
		rotation: 0.0,
		code_type: null,
		font_size: 12,
		font_id: 0,
		image_id: 0,
		data: null,
		template_id: null,
		...def,
	}
}
export function parseSplit(str: string): any[] {
	return str
		.trim()
		.split(',')
		.map(v => v.trim())
}
export function removeQuote(str: string) {
	return str.replace(/^"/, '').replace(/"$/, '')
}

export function regParse(reg: RegExp, str: string, def = {}) {
	if (reg.test(str)) {
		return { ...def, ...str.match(reg)?.groups }
	}
	return { ...def }
}

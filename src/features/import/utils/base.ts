import { storeTemplate } from '../../../entites/template/store'
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

export function setDirection(x: number, y: number) {
	if (x < 0 || x > 1) {
		throw new Error(
			`Неверное значение значение derection по x-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${x} в шаблон`
		)
	}
	if (y < 0 || y > 1) {
		throw new Error(
			`Неверное значение значение derection по y-координате. Допускается 0 или 1. Вы аытаетесь записать значение ${y} в шаблон`
		)
	}
	storeTemplate.changeDirection1(x)
	//storeTemplate.changeDirection2(y);
}
export function setSize(w: number, h: number) {
	if (w < 15 || w > 150) {
		throw new Error(
			`Неверное значение ширины. Нижний порог ширины 15мм, верхний 150мм. Вы пытаетесь записать значение ${w}`
		)
	}
	if (h < 15 || h > 400) {
		throw new Error(
			`Неверное значение высоты. Нижний порог высоты 15мм, верхний 150мм. Вы пытаетесь записать значение ${h}`
		)
	}
	storeTemplate.changeWidth(w)
	storeTemplate.changeHeight(h)
}
export function setGap(gap: number) {
	if (gap < 0 || gap > 30) {
		throw new Error(`Неверное значение gap.`)
	}
	storeTemplate.changeGap(gap)
}
export function setReference(x: number, y: number) {
	storeTemplate.changeRefX(x)
	storeTemplate.changeRefY(y)
}

export function regParse(reg: RegExp, str: string, def = {}) {
	if (reg.test(str)) {
		return { ...def, ...str.match(reg)?.groups }
	}
	return { ...def }
}

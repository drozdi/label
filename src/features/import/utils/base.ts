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

function buildRegPaths(paths: string[], options: Record<string, any> = {}) {
	const opts: Record<string, any> = {
		separator: ',',
		allowEmpty: false,
		...options,
	}

	const joined = paths
		.map(path => `(?<${path}>${opts?.[path] ? opts?.[path] : `[^${opts.separator}\\^]`}${opts.allowEmpty ? '*' : '+'})`)
		.join(`\\s*)?(?:${opts.separator}\\s*`)
	return paths.length > 1 ? `(?:\\s*${joined}\\s*)?` : `\\s*${joined}\\s*`
}
function buildRegTag(key: string, options: Record<string, any> = {}): string {
	const opts: Record<string, any> = {
		required: true,
		...options,
	}
	return `<${key.toLowerCase().replace(/[^a-z]/g, '')}>${opts.required ? '' : '(:?'}${key}${opts.required ? '' : ')?'}`
}
/**
 * Строит регулярное выражение с именованными группами для разбора путей
 *
 * @param key - Основной ключ (имя основной группы)
 * @param paths - Массив имен подгрупп
 * @param options - Опции:
 *   - required: boolean - обязательность основной группы (по умолчанию true)
 *   - separator: string - разделитель (по умолчанию ',')
 *   - allowEmpty: boolean - разрешать пустые значенияы (по умолчанию false)
 * @returns Строка регулярного выражения
 */
export function buildRegPath(
	key: string,
	paths: string[],
	options: {
		required?: boolean
		separator?: string
		allowEmpty?: boolean
		[key: string]: any
	} = {}
): string {
	const opts: Record<string, any> = {
		required: true,
		allowEmpty: false,
		separator: ',',
		...options,
	}
	return `(?${buildRegTag(key, opts) + buildRegPaths(paths, opts)})`
}

// tspl
// (?:A)?(?<t>[^,]*)?,(?<x>[0-9]*),(?<y>[0-9]*),(?<w>[0-9]*),(?<h>[0-9]*),(?<g>[0-9]*),(?<r>[01234567])(?<u>[ELH]*)?,(?<data>.*)\s*
// console.log(
// 	buildRegPath('A', ['a_t', 'a_x', 'a_y', 'a_w', 'a_h', 'a_g', 'a_r', 'a_data'], {
// 		required: true,
// 		separator: ',',
// 		allowEmpty: true,
// 		a_x: '[0-9]',
// 		a_y: '[0-9]',
// 		a_w: '[0-9]',
// 		a_h: '[0-9]',
// 		a_g: '[0-9]',
// 		a_r: '[01234567ELH]',
// 		a_data: '.',
// 	})
// )

// zpl
// console.log(
// 	buildRegPath('\\\^FO', ['fo_x', 'fo_y', 'fo_alignment'], { allowEmpty: true }) +
// 		buildRegPath('\\\^FB', ['fb_maxWidth', 'fb_maxLines', 'fb_lineSpacing', 'fb_alignment', 'fb_hangingIndent'], {
// 			required: false,
// 			allowEmpty: true,
// 		}) +
// 		buildRegPath('\\\^A@', ['a_orientation', 'a_height', 'a_width', 'a_path'], {
// 			required: false,
// 			a_orientation: 'NIRL',
// 			allowEmpty: true,
// 		}) +
// 		buildRegPath('\\\^FD', ['fd_data'], { allowEmpty: true })
// )

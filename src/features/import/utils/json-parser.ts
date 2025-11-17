import { storeTemplate } from '../../../entites/template/store'
import { genId } from '../../../shared/utils'
export const jsonParaser = {
	test(str: string) {
		return str.startsWith('{') && str.endsWith('}')
	},
	parse(str: string, dpi: number) {
		storeTemplate.clear(true)
		const parse = {
			...JSON.parse(str),
			id: undefined,
			dpi,
		}
		storeTemplate.loadTemplate({
			...parse,
			objects: parse.objects.map(item => ({
				...item,
				id: genId(),
			})),
		})
	},
}

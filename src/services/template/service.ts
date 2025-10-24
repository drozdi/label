import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { storeTemplates } from '../../entites/templates/store'
import { DEF_TEMPLATE, NEW_TEMPLATE_NAME } from '../../shared/constants'
import { genId, round } from '../../shared/utils'
import { useHistory } from '../history/hooks/use-history'
import { serviceNotifications } from '../notifications/service'

const history = useHistory()

export const serviceTemplate = {
	copyStack: [],
	indexPaste: 1,
	copyOffset: 5,
	get id() {
		return storeTemplate.id
	},
	get scale() {
		return storeTemplate.scale
	},
	clear() {
		this.copyStack = []
		this.indexPaste = 1
		this.copyOffset = 5
	},

	async newName() {
		storeTemplates.clear()
		await storeTemplates.load(true)
		let prefix = -1
		storeTemplates.list.map(template => {
			const res = new RegExp(NEW_TEMPLATE_NAME + ' *(?<n>[0-9]*)').exec(template.name)
			if (res) {
				prefix = Math.max(prefix, Number(res.groups.n) || 0)
			}
		})
		return NEW_TEMPLATE_NAME + (prefix > -1 ? ` ${prefix + 1}` : '')
	},

	setName(v) {
		const name = storeTemplate.current?.name
		storeTemplate.current?.setName(v)
		history.append(storeTemplate.objects, `Переименование "${name}" в "${v}"`)
	},

	_moveX(value: number) {
		storeTemplate.selectedIndex.forEach(index => {
			if (index > -1) {
				storeTemplate.objects[index].setPosX(round(storeTemplate.objects[index].pos_x + value))
				storeTemplate.objects[index] = storeTemplate.objects[index].copy()
			}
		})
	},
	_moveY(value: number) {
		storeTemplate.selectedIndex.forEach(index => {
			if (index > -1) {
				storeTemplate.objects[index].setPosY(round(storeTemplate.objects[index].pos_y + value))
				storeTemplate.objects[index] = storeTemplate.objects[index].copy()
			}
		})
	},
	move(dx: number, dy: number) {
		this._moveX(dx)
		this._moveY(dy)
		if (dx !== 0 || dy !== 0) {
			history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
		}
	},
	moveX(value: number) {
		if (value === 0) {
			return
		}
		this._moveX(value)
		history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
	},
	moveY(value: number) {
		if (value === 0) {
			return
		}
		this._moveY(value)
		history.appendDebounce(storeTemplate.objects, `Смещение элементов`)
	},
	deleteObject() {
		;[...storeTemplate.selected].forEach(id => {
			const object = storeTemplate.findById(id)
			storeTemplate.deleteObject(id)
			history.append(storeTemplate.objects, `Удаление "${object.name}"`, {
				title: `Тип: ${object.type} ${object.code_type}`,
			})
		})
	},

	copy() {
		this.copyStack = storeTemplate.selectedObjects.map(object => object.getProps())
		this.indexPaste = 1
	},
	paste() {
		if (this.copyStack.length > 0) {
			const selected = []
			this.copyStack.forEach(props => {
				const id = genId()
				storeTemplate.addObject({
					...props,
					id: id,
					pos_x: props.pos_x + this.copyOffset * this.indexPaste,
					pos_y: props.pos_y + this.copyOffset * this.indexPaste,
				})
				selected.push(id)
			})
			this.indexPaste += 1
			storeTemplate.selected = selected
		}
	},
	async handleSave() {
		if (storeTemplate.name?.length < 3) {
			serviceNotifications.error('Название шаблона должно быть не менее 3 символов')
			storeApp.setErrorName(true)
			return
		}
		if (storeTemplate.objects.length === 0) {
			serviceNotifications.error('Шаблон не может быть пустым')
			return
		}

		const template = {
			...DEF_TEMPLATE,
			...storeTemplate,
			objects: storeTemplate.objects.map(item => item.getProps()),
			scale: undefined,
			dpi: undefined,
			mm: undefined,
			cm: undefined,
			mm_qr: undefined,
			selected: undefined,
		}

		if (storeTemplate.id > 0) {
			await this.handleUpdate(template)
		} else {
			await this.handleNew(template)
		}
	},
	async handleUpdate(template) {
		try {
			await storeTemplates.updateTemplate(template)
			serviceNotifications.success('Шаблон успешно изменён')
			storeApp.setErrorName(false)
		} catch (error) {
			serviceNotifications.error(error)
		}
	},
	async handleNew(template) {
		try {
			const res = await storeTemplates.newTemplate(template)
			storeTemplate.loadTemplate(res.data)
			serviceNotifications.success('Шаблон успешно сохранён')
			storeApp.setErrorName(false)
		} catch (error) {
			serviceNotifications.error(error)
		}
	},
}

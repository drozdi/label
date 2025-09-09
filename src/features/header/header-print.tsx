import { Button, Group, Textarea } from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { storePrinter } from '../../entites/printer/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceNotifications } from '../../services/notifications/service'
import { servicePrinter } from '../../services/printer/service'

export const HeaderPrint = observer(() => {
	const handlePrintCode = async () => {
		if (!storeTemplates.selected) {
			serviceNotifications.alert('Сохраните шаблон или выберите из БД')
			return
		}
		const res = await servicePrinter.codePrint(storeTemplates.selected.id)
		if (res === undefined) return
		modals.open({
			title: `Код для принтера на "${storePrinter.getConfig().type_printer}"`,
			size: 'lg',
			children: (
				<Textarea readOnly rows={20} size='lg' defaultValue={res.trim()} />
			),
		})
	}
	const handlePrintTrial = async () => {
		if (!storeTemplates.selected) {
			serviceNotifications.alert('Сохраните шаблон или выберите из БД')
			return
		}
		const res = await servicePrinter.trialPrint(storeTemplates.selected.id)
		if (res === undefined) return
		modals.open({
			title: `Код для принтера на "${storePrinter.getConfig().type_printer}"`,
			size: 'lg',
			children: (
				<Textarea readOnly rows={20} size='lg' defaultValue={res.trim()} />
			),
		})
	}
	const handlePrintExample = async () => {
		if (!storeTemplates.selected) {
			serviceNotifications.alert('Сохраните шаблон или выберите из БД')
			return
		}
		const res = await servicePrinter.examplePrint(storeTemplates.selected.id)
		if (res === undefined) return
		modals.open({
			title: `Код для принтера на "${storePrinter.getConfig().type_printer}"`,
			size: 'lg',
			children: (
				<Textarea readOnly rows={20} size='lg' defaultValue={res.trim()} />
			),
		})
	}

	return (
		<Group gap='xs'>
			<Button variant='outline' onClick={handlePrintCode}>
				Код печати
			</Button>
			<Button variant='outline' onClick={handlePrintExample}>
				Пример печати
			</Button>
			<Button variant='outline' onClick={handlePrintTrial}>
				Пробная печать
			</Button>
		</Group>
	)
})

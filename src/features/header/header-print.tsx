import { Button, Textarea } from '@mantine/core'
import { modals } from '@mantine/modals'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storePrinter } from '../../entites/printer/store'
import { storeTemplates } from '../../entites/templates/store'
import { serviceNotifications } from '../../services/notifications/service'
import { servicePrinter } from '../../services/printer/service'
import { Header } from '../../shared/ui'

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
			children: <Textarea readOnly rows={20} size='lg' defaultValue={res.trim()} />,
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
			children: <Textarea readOnly rows={20} size='lg' defaultValue={res.trim()} />,
		})
	}
	const handlePrintExample = async () => {
		if (!storeTemplates.selected) {
			serviceNotifications.alert('Сохраните шаблон или выберите из БД')
			return
		}
		const res = await servicePrinter.examplePrint(storeTemplates.selected.id)
		if (res === undefined) return
		serviceNotifications.success(`Код для принтера на "${storePrinter.getConfig().type_printer}"`, res.trim())
	}

	return (
		<Header>
			<Button
				variant='outline'
				color={storeApp.importFlag ? 'lime' : ''}
				onClick={() => storeApp?.setImportFlag(!storeApp.importFlag)}
			>
				Импорт кода
			</Button>
			{storeApp.offlineMode ? (
				<Button
					variant='outline'
					color={storeApp.genCodeFlag ? 'lime' : ''}
					onClick={() => storeApp?.setGenCodeFlag(!storeApp.genCodeFlag)}
				>
					Эксопрт кода
				</Button>
			) : (
				<>
					<Button variant='outline' onClick={handlePrintCode}>
						Код печати
					</Button>
					<Button variant='outline' onClick={handlePrintExample}>
						Пример печати
					</Button>
					<Button variant='outline' onClick={handlePrintTrial}>
						Пробная печать
					</Button>
				</>
			)}
		</Header>
	)
})

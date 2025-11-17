import { Divider, Modal, Tabs, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storePrinter } from '../../entites/printer/store'
import { ManagerFontFamily } from '../fonts/manager-font-family'
import { ManagerImages } from '../images/manager-images'
import { AppSettings } from './app-settings'
import { PrinterSettings } from './printer-settings'

export const Settings = observer(() => {
	const { fonts, images } = storePrinter.memory
	return (
		<Modal opened={storeApp.settingsFlag} onClose={() => storeApp.setSettingsFlag(false)} title='Настройки' size='xl'>
			<Tabs defaultValue='app'>
				<Tabs.List>
					<Tabs.Tab value='app'>Приложение</Tabs.Tab>
					<Tabs.Tab value='printer'>Принтер</Tabs.Tab>
					<Tabs.Tab value='fonts'>Шрифты</Tabs.Tab>
					<Tabs.Tab value='images'>Изображения</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel keepMounted value='app'>
					<AppSettings />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='printer'>
					<PrinterSettings />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='fonts'>
					<ManagerFontFamily />
					<Divider my='xs' />
					<Text fz='h3'>Загруженные шрифты в принтер</Text>
					{fonts?.length > 0 ? fonts.map(item => item.replace(':', ' - ')).join(', ') : 'Пусто'}
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='images'>
					<ManagerImages />
					<Divider my='xs' />
					<Text fz='h3'>Загруженные изображения в принтер</Text>
					{images?.length > 0 ? images.join(', ') : 'Пусто'}
				</Tabs.Panel>
			</Tabs>
		</Modal>
	)
})

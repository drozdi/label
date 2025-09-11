import { Modal, Tabs } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { ManagerFontFamily } from '../fonts/manager-font-family'
import { ManagerImages } from '../images/manager-images'
import { AppSettings } from './app-settings'
import { PrinterSettings } from './printer-settings'

export const Settings = observer(() => {
	return (
		<Modal
			opened={storeApp.settingsFlag}
			onClose={() => storeApp.setSettingsFlag(false)}
			title='Настройки'
			size='xl'
		>
			<Tabs defaultValue='app'>
				<Tabs.List>
					<Tabs.Tab value='app'>Приложение</Tabs.Tab>
					<Tabs.Tab value='printer'>Принтер</Tabs.Tab>
					<Tabs.Tab value='fonts'>Шрифты</Tabs.Tab>
					<Tabs.Tab value='images'>Изображения</Tabs.Tab>
				</Tabs.List>
				<Tabs.Panel keepMounted value='app' pt='xs'>
					<AppSettings />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='printer' pt='xs'>
					<PrinterSettings />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='fonts' pt='xs'>
					<ManagerFontFamily />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='images' pt='xs'>
					<ManagerImages />
				</Tabs.Panel>
			</Tabs>
		</Modal>
	)
})

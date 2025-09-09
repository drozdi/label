import { Modal, Tabs } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
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
				</Tabs.List>
				<Tabs.Panel keepMounted value='app' pt='xs'>
					<AppSettings />
				</Tabs.Panel>
				<Tabs.Panel keepMounted value='printer' pt='xs'>
					<PrinterSettings />
				</Tabs.Panel>
			</Tabs>
		</Modal>
	)
})

import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../entites/app/store'
import { storeHistory } from '../entites/history/store'
import { storeTemplate } from '../entites/template/store'
import { requestVariablesList } from '../entites/variables/api'
import { AutoSave } from '../features/auto-save/auto-save'
import { ModalGenCode } from '../features/gen-code/modal-gen-code'
import { Import } from '../features/import/import'
import { JsonCode } from '../features/json-code/json-code'
import { Preview } from '../features/preview/preview'
import { Settings } from '../features/settings/settings'
import { KEY_API_HOST } from '../shared/constants'
import { DefaultSettings } from '../widgets/DefaultSettings'
import { Editor } from '../widgets/Editor'
import { ErrorServer } from '../widgets/ErrorServer'
import { Header } from '../widgets/Header'
import { Templates } from '../widgets/Templates'

export const App = observer(() => {
	useEffect(() => {
		storeApp.setDefaultSettings(!Boolean(localStorage.getItem(KEY_API_HOST)))
		//storeApp.setOfflineMode(true)
	}, [])
	useEffect(() => {
		if (storeApp.defaultSettings) {
			return
		}
		const check = async () => {
			storeApp.setServerError(false)
			try {
				await requestVariablesList()
			} catch (e) {
				if (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED') {
					storeApp.setServerError(true)
				}
			}
		}
		storeHistory.fn = ({ objects }) => {
			storeTemplate.loadObjects(JSON.parse(JSON.stringify(objects)))
		}
		storeTemplate.clear()
		check()
	}, [storeApp.defaultSettings])

	console.log(storeApp.defaultSettings, storeApp.serverError)

	return (
		<>
			{storeApp.defaultSettings ? (
				<DefaultSettings />
			) : (
				<>
					<Stack h='100vh' w='100vw' gap='0' align='stretch' justify='flex-start'>
						{storeApp.serverError ? (
							<ErrorServer />
						) : (
							<>
								<Header />
								{storeApp.loadTemplateFlag ? <Templates /> : <Editor />}
							</>
						)}
					</Stack>
					<AutoSave />
					<Settings />
					<Import />
					<Preview />
					<JsonCode />
					<ModalGenCode />
				</>
			)}
		</>
	)
})

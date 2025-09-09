import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../entites/app/store'
import { requestFontsList } from '../entites/fonts/api'
import { storeHistory } from '../entites/history/store'
import { storeTemplate } from '../entites/template/store'
import { Import } from '../features/import/import'
import { JsonCode } from '../features/json-code/json-code'
import { Preview } from '../features/preview/preview'
import { Settings } from '../features/settings/setting'
import { Editor } from '../widgets/Editor'
import { ErrorServer } from '../widgets/ErrorServer'
import { Header } from '../widgets/Header'
import { Templates } from '../widgets/Templates'

export const App = observer(() => {
	useEffect(() => {
		const check = async () => {
			try {
				await requestFontsList()
			} catch (e) {
				if (e.code === 'ERR_NETWORK') {
					storeApp.setServerError(true)
				}
			}
		}
		storeHistory.fn = ({ objects }) => {
			storeTemplate.loadObjects(JSON.parse(JSON.stringify(objects)))
		}
		storeTemplate.clear()
		check()
	}, [])

	return (
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
			<Settings />
			<Import />
			<Preview />
			<JsonCode />
		</>
	)
})

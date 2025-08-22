import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { requestFontsList } from './entites/fonts/api'
import { storeFonts } from './entites/fonts/store'
import { storeHistory } from './entites/history/store'
import { storeImages } from './entites/images/store'
import { storePrinter } from './entites/printer/store'
import { storeTemplate } from './entites/template/store'
import { storeTemplates } from './entites/templates/store'
import { storeVariables } from './entites/variables/store'
import { AppContextProvider } from './features/context'
import { ManagerFontFamily } from './features/fonts/manager-font-family'
import { ManagerImages } from './features/images/manager-images'
import { Import } from './features/import/import'
import { Loader } from './features/loader/Loader'
import { Preview } from './features/preview/preview'
import { Settings } from './features/settings/setting'
import { Editor } from './widgets/Editor'
import { ErrorServer } from './widgets/ErrorServer'
import { Header } from './widgets/Header'
import { Templates } from './widgets/Templates'

const App = observer(() => {
	const [fontFamilyFlag, setFontFamilyFlag] = useState(false)
	const [variableFlag, setVariableFlag] = useState(false)
	const [imageFlag, setImageFlag] = useState(false)
	const [gridFlag, setGridFlag] = useState(false)
	const [imageBg, setImageBg] = useState(false)
	const [loadTemplateFlag, setLoadTemplateFlag] = useState(false)
	const [settingsFlag, setSettingsFlag] = useState(false)
	const [importFlag, setImportFlag] = useState(false)
	const [dataMatrixFlag, setDataMatrixFlag] = useState(false)
	const [previewFlag, setPreviewFlag] = useState(false)
	const [serverError, setServerError] = useState(false)
	const [managerFontFamilyFlag, setManagerFontFamilyFlag] = useState(false)
	const [managerImagesFlag, setManagerImagesFlag] = useState(false)

	const visible = useMemo(
		() =>
			storeTemplates.isLoading ||
			storeImages.isLoading ||
			storeFonts.isLoading ||
			storeVariables.isLoading ||
			storePrinter.isLoading,
		[
			storeTemplates.isLoading,
			storeImages.isLoading,
			storeFonts.isLoading,
			storeVariables.isLoading,
			storePrinter.isLoading,
		]
	)

	const context = useMemo(
		() => ({
			fontFamilyFlag,
			setFontFamilyFlag,
			variableFlag,
			setVariableFlag,
			imageFlag,
			setImageFlag,
			loadTemplateFlag,
			setLoadTemplateFlag,
			settingsFlag,
			setSettingsFlag,
			dataMatrixFlag,
			setDataMatrixFlag,
			importFlag,
			setImportFlag,
			gridFlag,
			setGridFlag,
			imageBg,
			setImageBg,
			previewFlag,
			setPreviewFlag,
			serverError,
			setServerError,
			managerFontFamilyFlag,
			setManagerFontFamilyFlag,
			managerImagesFlag,
			setManagerImagesFlag,
		}),
		[
			fontFamilyFlag,
			imageFlag,
			variableFlag,
			loadTemplateFlag,
			settingsFlag,
			dataMatrixFlag,
			importFlag,
			gridFlag,
			imageBg,
			previewFlag,
			serverError,
			managerFontFamilyFlag,
			managerImagesFlag,
		]
	)

	useEffect(() => {
		const check = async () => {
			try {
				await requestFontsList()
			} catch (e) {
				if (e.code === 'ERR_NETWORK') {
					setServerError(true)
				}
			}
		}
		storeHistory.fn = ({ objects }) => {
			storeTemplate.loadObjects(JSON.parse(JSON.stringify(objects)))
		}
		storeTemplate.clear()
		//check()
	}, [])

	return (
		<AppContextProvider value={context}>
			<Stack h='100vh' w='100vw' align='stretch' justify='flex-start'>
				{serverError ? (
					<ErrorServer />
				) : (
					<>
						<Loader visible={visible} />
						<Header />
						{loadTemplateFlag ? <Templates /> : <Editor />}
					</>
				)}
			</Stack>
			<Settings />
			<Import />
			<Preview />
			<ManagerFontFamily />
			<ManagerImages />
		</AppContextProvider>
	)
})

export default App

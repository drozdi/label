import { LoadingOverlay, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { storeFonts } from './entites/fonts/store'
import { storeImages } from './entites/images/store'
import { storeTemplates } from './entites/templates/store'
import { storeVariables } from './entites/variables/store'
import { AppContextProvider } from './features/context'
import { Settings } from './features/settings/setting'
import { Editor } from './widgets/Editor'
import { Header } from './widgets/Header'
import { Templates } from './widgets/Templates'

const App = observer(() => {
	const [fontFamilyFlag, setFontFamilyFlag] = useState(false)
	const [variableFlag, setVariableFlag] = useState(false)
	const [imageFlag, setImageFlag] = useState(false)
	const [loadTemplateFlag, setLoadTemplateFlag] = useState(false)
	const [settingsFlag, setSettingsFlag] = useState(false)
	const [dataMatrixFlag, setDataMatrixFlag] = useState(false)

	const visible = useMemo(
		() =>
			storeTemplates.isLoading ||
			storeImages.isLoading ||
			storeFonts.isLoading ||
			storeVariables.isLoading,
		[
			storeTemplates.isLoading,
			storeImages.isLoading,
			storeFonts.isLoading,
			storeVariables.isLoading,
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
		}),
		[
			fontFamilyFlag,
			imageFlag,
			variableFlag,
			loadTemplateFlag,
			settingsFlag,
			dataMatrixFlag,
		]
	)
	return (
		<AppContextProvider value={context}>
			<Stack h='100vh' w='100vw' align='stretch' justify='flex-start'>
				<LoadingOverlay
					visible={visible}
					zIndex={1000}
					overlayProps={{ radius: 'sm', blur: 2 }}
				/>
				<Header />
				{loadTemplateFlag ? <Templates /> : <Editor />}
			</Stack>
			<Settings />
		</AppContextProvider>
	)
})

export default App

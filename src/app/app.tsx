import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState } from 'react'
import { requestFontsList } from '../entites/fonts/api'
import { storeHistory } from '../entites/history/store'
import { storeTemplate } from '../entites/template/store'
import { AppContextProvider } from '../features/context'
import { Import } from '../features/import/import'
import { Preview } from '../features/preview/preview'
import { Settings } from '../features/settings/setting'
import { Editor } from '../widgets/Editor'
import { ErrorServer } from '../widgets/ErrorServer'
import { Header } from '../widgets/Header'
import { Templates } from '../widgets/Templates'

export const App = observer(() => {
	const [fontFamilyFlag, setFontFamilyFlag] = useState<boolean>(false)
	const [variableFlag, setVariableFlag] = useState<boolean>(false)
	const [imageFlag, setImageFlag] = useState<boolean>(false)
	const [gridFlag, setGridFlag] = useState<boolean>(false)
	const [imageBg, setImageBg] = useState<string>('')
	const [loadTemplateFlag, setLoadTemplateFlag] = useState<boolean>(false)
	const [settingsFlag, setSettingsFlag] = useState<boolean>(false)
	const [importFlag, setImportFlag] = useState<boolean>(false)
	const [dataMatrixFlag, setDataMatrixFlag] = useState<boolean>(false)
	const [previewFlag, setPreviewFlag] = useState<boolean>(false)
	const [serverError, setServerError] = useState<boolean>(false)
	const [managerFontFamilyFlag, setManagerFontFamilyFlag] =
		useState<boolean>(false)
	const [managerImagesFlag, setManagerImagesFlag] = useState<boolean>(false)

	const context = useMemo<AppContext>(
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

	/*const str = 'BAR 80,80,300,100'
	const p =
		/(?:BAR)?\s*(?<pos_x>[0-9]*)\s*,\s*(?<pos_y>[0-9]*)\s*,\s*(?<width>[0-9]*)\s*,\s*(?<height>[0-9]*)/
	const resM = str.match(p)
	const resE = p.exec(str)
	console.log(resM)
	console.log(resE)//*/
	return (
		<AppContextProvider value={context}>
			<Stack h='100vh' w='100vw' gap='0' align='stretch' justify='flex-start'>
				{serverError ? (
					<ErrorServer />
				) : (
					<>
						<Header />
						{loadTemplateFlag ? <Templates /> : <Editor />}
					</>
				)}
			</Stack>
			<Settings />
			<Import />
			<Preview />
		</AppContextProvider>
	)
})

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { storeApp } from '../entites/app/store'
import { storeDataMatrix } from '../entites/data-matrix/store'
import { storeFonts } from '../entites/fonts/store'
import { storeImages } from '../entites/images/store'
import { storePrinter } from '../entites/printer/store'
import { storeTemplates } from '../entites/templates/store'
import { storeVariables } from '../entites/variables/store'
import { Loader } from '../features/loader/loader'

export const AppLoader = observer(({ children }: { children: React.ReactNode }) => {
	const visible = useMemo<boolean>(
		() =>
			storeTemplates.isLoading ||
			storeImages.isLoading ||
			storeFonts.isLoading ||
			storeVariables.isLoading ||
			storeDataMatrix.isLoading ||
			storePrinter.isLoading,
		[
			storeTemplates.isLoading,
			storeImages.isLoading,
			storeFonts.isLoading,
			storeVariables.isLoading,
			storePrinter.isLoading,
			storeDataMatrix.isLoading,
		]
	)

	useEffect(() => {
		if (storeApp.defaultSettings) {
			return
		}
		storeFonts.load()
		storeImages.load()
		storeVariables.load()
		storeDataMatrix.load()
	}, [storeApp.defaultSettings])

	return (
		<>
			{children}
			<Loader visible={visible} />
		</>
	)
})

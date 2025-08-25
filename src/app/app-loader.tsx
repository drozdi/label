import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { storeFonts } from '../entites/fonts/store'
import { storeImages } from '../entites/images/store'
import { storePrinter } from '../entites/printer/store'
import { storeTemplates } from '../entites/templates/store'
import { storeVariables } from '../entites/variables/store'
import { Loader } from '../features/loader/Loader'
export const AppLoader = observer(
	({ children }: { children: React.ReactNode }) => {
		const visible = useMemo<boolean>(
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

		useEffect(() => {
			storeFonts.load()
			storeVariables.load()
			storeImages.load()
		}, [])
		return (
			<>
				{children}
				<Loader visible={visible} />
			</>
		)
	}
)

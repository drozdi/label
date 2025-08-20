import { useEffect, useMemo } from 'react'
import { storeFonts } from '../entites/fonts/store'
import { storeImages } from '../entites/images/store'
import { storePrinter } from '../entites/printer/store'
import { storeTemplates } from '../entites/templates/store'
import { storeVariables } from '../entites/variables/store'
export function AppLoader({ children }: { children: React.ReactNode }) {
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
	useEffect(() => {
		storeFonts.load()
		storeVariables.load()
		storeImages.load()
	}, [])
	return children
}

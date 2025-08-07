import { useEffect } from 'react'
import { storeFonts } from '../entites/fonts/store'
import { storeVariables } from '../entites/variables/store'
export function AppLoader({ children }: { children: React.ReactNode }) {
	const { isLoading: fontsIsLoading } = storeFonts
	useEffect(() => {
		storeFonts.load()
		storeVariables.load()
	}, [])
	return children
}

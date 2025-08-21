import { useEffect } from 'react'
import { storeFonts } from '../entites/fonts/store'
import { storeImages } from '../entites/images/store'
import { storeVariables } from '../entites/variables/store'
export function AppLoader({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		storeFonts.load()
		storeVariables.load()
		storeImages.load()
	}, [])
	return children
}

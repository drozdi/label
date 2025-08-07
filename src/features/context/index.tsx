import { createContext, useContext } from 'react'

const context = createContext()

export function useAppContext() {
	return useContext(context)
}

export function AppContextProvider({ children, value }) {
	return <context.Provider value={value}>{children}</context.Provider>
}

import { createContext, useContext } from 'react'

const context = createContext<AppContext>({})

export function useAppContext(): AppContext {
	return useContext(context)
}

export function AppContextProvider({
	children,
	value,
}: {
	children: React.ReactNode
	value: AppContext
}): React.ReactElement {
	return <context.Provider value={value}>{children}</context.Provider>
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AppLoader } from './app/app-loader.tsx'
import { AppProvider } from './app/app-provider'

createRoot(document.querySelector('body')!).render(
	<AppProvider>
		<AppLoader>
			<App />
		</AppLoader>
	</AppProvider>
)

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import { AppLoader } from './app/app-loader'
import { AppProvider } from './app/app-provider'

createRoot(document.querySelector('body')!).render(
	<AppProvider>
		<AppLoader>
			<App />
		</AppLoader>
	</AppProvider>
)

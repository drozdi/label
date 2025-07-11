import { Box, Group } from '@mantine/core'
import { ListProperties } from './features/properties/ListProperties'
import { LabelTolbar } from './features/toolbars/LabelTolbar'
const App = () => {
	return (
		<Box h='100vh' w='100vw'>
			<Box>
				<LabelTolbar />
			</Box>
			<Group grow>
				<Box flex='none' w='16rem' maw='100%'>
					left
				</Box>
				<Box flex='auto' w='auto' maw='100%'>
					center
				</Box>
				<Box flex='none' w='16rem' maw='100%'>
					<ListProperties />
				</Box>
			</Group>
		</Box>
	)
}

export default App

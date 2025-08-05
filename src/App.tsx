import { Box, Button, Group, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from './entites/template/store'
import { ListProperties } from './features/properties/ListProperties'
import { Band } from './features/template/Band'
import { Template } from './features/template/Template'
import { LabelTolbar } from './features/toolbars/template/LabelTolbar'
const App = observer(() => {
	return (
		<Stack h='100vh' w='100vw' p='md' align='stretch' justify='flex-start'>
			<Box>
				<LabelTolbar />
			</Box>
			<Group grow h='100%'>
				<Box flex='none' w='16rem' maw='100%' h='100%'>
					<Button onClick={() => console.log({ ...storeTemplate.objects })}>
						check
					</Button>
				</Box>
				<Box flex='auto' w='auto' maw='100%' h='100%'>
					<Box h='100%'>
						<Band>
							<Template />
						</Band>
					</Box>
				</Box>
				<Box flex='none' w='16rem' maw='100%' h='100%'>
					<ListProperties />
				</Box>
			</Group>
		</Stack>
	)
})

export default App

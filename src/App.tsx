import { Box, Button, Group, Stack, Tabs } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'
import { storeTemplate } from './entites/template/store'
import { AppContextProvider } from './features/context'
import { ContainerElement } from './features/elements/container-element'
import { ContainerFontFamily } from './features/fonts/container-font-family'
import { ContainerImage } from './features/images/container-image'
import { ListLayers } from './features/layers/list-layers'
import { ListProperties } from './features/properties/list-properties'
import { Band } from './features/template/band'
import { Template } from './features/template/template'
import { LabelTolbar } from './features/toolbars/template/label-tolbar'
import { ContainerVariable } from './features/variables/container-variable'

const App = observer(() => {
	const [fontFamilyFlag, setFontFamilyFlag] = useState(false)
	const [variableFlag, setVariableFlag] = useState(false)
	const [imageFlag, setImageFlag] = useState(false)

	const context = useMemo(
		() => ({
			fontFamilyFlag,
			setFontFamilyFlag,
			variableFlag,
			setVariableFlag,
			imageFlag,
			setImageFlag,
		}),
		[fontFamilyFlag, imageFlag, variableFlag]
	)
	return (
		<AppContextProvider value={context}>
			<Stack h='100vh' w='100vw' align='stretch' justify='flex-start'>
				<Box>
					<LabelTolbar />
				</Box>
				<Group grow h='100%'>
					<Box
						flex='none'
						w='18rem'
						maw='100%'
						h='100%'
						px='xs'
						style={{
							overflow: 'auto',
						}}
					>
						<ContainerElement />
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
					<Box
						flex='none'
						w='18rem'
						maw='100%'
						h='100%'
						px='xs'
						style={{
							overflowX: 'hidden',
							overflowY: 'auto',
						}}
					>
						{fontFamilyFlag ? (
							<ContainerFontFamily />
						) : variableFlag ? (
							<ContainerVariable />
						) : imageFlag ? (
							<ContainerImage />
						) : (
							<Tabs defaultValue='properties'>
								<Tabs.List>
									<Tabs.Tab value='properties'>Свойства</Tabs.Tab>
									<Tabs.Tab value='layers'>Слои</Tabs.Tab>
									<Tabs.Tab value='histories'>История</Tabs.Tab>
								</Tabs.List>
								<Tabs.Panel keepMounted value='properties' p='0.5rem'>
									{storeTemplate.isOne() && <ListProperties />}
								</Tabs.Panel>
								<Tabs.Panel keepMounted value='layers' p='0.5rem'>
									<ListLayers />
								</Tabs.Panel>
								<Tabs.Panel keepMounted value='histories' p='0.5rem'>
									histories
								</Tabs.Panel>
							</Tabs>
						)}
					</Box>
				</Group>
			</Stack>
		</AppContextProvider>
	)
})

export default App

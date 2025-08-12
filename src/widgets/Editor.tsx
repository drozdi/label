import { Box, Group, Tabs } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../entites/template/store'
import { useAppContext } from '../features/context'
import { ContainerDataMatrix } from '../features/data-matrix/container-data-matrix'
import { ContainerElement } from '../features/elements/container-element'
import { ContainerFontFamily } from '../features/fonts/container-font-family'
import { ContainerImage } from '../features/images/container-image'
import { ListLayers } from '../features/layers/list-layers'
import { ListProperties } from '../features/properties/list-properties'
import { Band } from '../features/template/band'
import { Template } from '../features/template/template'
import { LabelTolbar } from '../features/toolbars/template/label-tolbar'
import { ContainerVariable } from '../features/variables/container-variable'

export const Editor = observer(() => {
	const { fontFamilyFlag, variableFlag, imageFlag, dataMatrixFlag } =
		useAppContext()
	return (
		<>
			<Box>
				<LabelTolbar />
			</Box>
			<Group grow h='100%'>
				<Box flex='none' w='18rem' h='100%' px='sm'>
					{dataMatrixFlag ? <ContainerDataMatrix /> : <ContainerElement />}
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
					px='sm'
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
		</>
	)
})

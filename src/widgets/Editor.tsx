import { Box, Group, ScrollArea, Tabs, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../entites/template/store'
import { Band } from '../features/band/band'
import { useAppContext } from '../features/context'
import { ContainerDataMatrix } from '../features/data-matrix/container-data-matrix'
import { ContainerElement } from '../features/elements/container-element'
import { ContainerFontFamily } from '../features/fonts/container-font-family'
import { ListHistory } from '../features/history/list-history'
import { ContainerImage } from '../features/images/container-image'
import { ListLayers } from '../features/layers/list-layers'
import { ListProperties } from '../features/properties/list-properties'
import { Template } from '../features/template/template'
import { LabelTolbar } from '../features/toolbars/template/label-tolbar'
import { ToolbarTools } from '../features/toolbars/tools/toolbar-tools'
import { ContainerVariable } from '../features/variables/container-variable'

export const Editor = observer(() => {
	const { fontFamilyFlag, variableFlag, imageFlag, dataMatrixFlag } =
		useAppContext()
	return (
		<>
			<LabelTolbar />
			<Box
				h='100%'
				style={{
					display: 'grid',
					gridTemplateColumns: '18rem 1fr 18rem',
					gridTemplateRows: '1fr',
					overflow: 'hidden',
				}}
			>
				<Group
					justify='space-between'
					h='100%'
					gap='0'
					style={{
						borderRight: '1px solid var(--mantine-color-default-border)',
					}}
				>
					<Box flex='auto' h='100%' px='xs'>
						{dataMatrixFlag ? <ContainerDataMatrix /> : <ContainerElement />}
					</Box>
					<Box flex='auto' h='100%' w='2rem' p='xs'>
						<ToolbarTools />
					</Box>
				</Group>
				<ScrollArea h='100%' p='xs'>
					<Band>
						<Template />
					</Band>
				</ScrollArea>
				<Box
					h='100%'
					px='xs'
					style={{
						overflowX: 'hidden',
						overflowY: 'auto',
						borderLeft: '1px solid var(--mantine-color-default-border)',
					}}
				>
					{fontFamilyFlag ? (
						<ContainerFontFamily />
					) : variableFlag ? (
						<ContainerVariable />
					) : imageFlag ? (
						<ContainerImage />
					) : (
						<Tabs defaultValue='properties' h='100%'>
							<Tabs.List>
								<Tabs.Tab value='properties'>Свойства</Tabs.Tab>
								<Tabs.Tab value='layers'>Слои</Tabs.Tab>
								<Tabs.Tab value='histories'>История</Tabs.Tab>
							</Tabs.List>
							<Tabs.Panel keepMounted value='properties' p='0.5rem'>
								{storeTemplate.objects.length === 0 ? (
									<Text c='dimmed' size='xl'>
										Нет ни одного объекта
									</Text>
								) : storeTemplate.isOne() ? (
									<ListProperties />
								) : storeTemplate.selected.length > 1 ? (
									<Text c='dimmed' size='xl'>
										Выбрано несколько объектов
									</Text>
								) : (
									<Text c='dimmed' size='xl'>
										Не один объект не выбран
									</Text>
								)}
							</Tabs.Panel>
							<Tabs.Panel keepMounted value='layers' p='0.5rem'>
								{storeTemplate.objects.length === 0 ? (
									<Text c='dimmed' size='xl'>
										Нет ни одного объекта
									</Text>
								) : (
									<ListLayers />
								)}
							</Tabs.Panel>
							<Tabs.Panel keepMounted value='histories' p='0.5rem'>
								<ListHistory />
							</Tabs.Panel>
						</Tabs>
					)}
				</Box>
			</Box>
		</>
	)
})

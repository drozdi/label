import { Box, Button, ScrollArea, Stack, Tabs, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../entites/app/store'
import { storeTemplate } from '../entites/template/store'
import { Band } from '../features/band/band'
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
import { ProvideGuideLine } from '../services/guide-line/context'

export const Editor = observer(() => {
	const { fontFamilyFlag, variableFlag, imageFlag, dataMatrixFlag } = storeApp
	useEffect(() => {
		const mouseDown = (event: MouseEvent) => {
			if (event.altKey && event.ctrlKey && event.button === 2) {
				storeApp.setJsonCodeFlag(true)
				event.preventDefault()
				event.stopPropagation()
			}
		}
		document.addEventListener('mousedown', mouseDown)
		return () => {
			try {
				document.removeEventListener('mousedown', mouseDown)
			} catch (error) {
				console.log(error)
			}
		}
	}, [])
	return (
		<ProvideGuideLine>
			<LabelTolbar />
			<Box
				h='100%'
				style={{
					display: 'grid',
					gridTemplateColumns: 'minmax(min-content, auto) minmax(auto, 1fr) minmax(min-content, auto)',
					gridTemplateRows: '1fr',
					overflow: 'hidden',
					width: '100%',
					//maxWidth: 'var(--mantine-breakpoint-xl)',
					margin: '0 auto',
				}}
			>
				<Stack
					h='100%'
					w='18rem'
					justify='space-between'
					style={{
						borderRight: '1px solid var(--mantine-color-default-border)',
						overflowX: 'hidden',
						overflowY: 'auto',
					}}
				>
					<Box
						h='100%'
						px='xs'
						style={{
							display: 'grid',
							gridTemplateColumns: 'minmax(auto, 1fr) minmax(min-content, auto)',
							gridTemplateRows: '1fr',
							gap: 'var(--mantine-spacing-xs)',
							overflowX: 'hidden',
							overflowY: 'auto',
						}}
					>
						<Box
							h='100%'
							style={{
								overflowX: 'hidden',
								overflowY: 'auto',
							}}
						>
							{dataMatrixFlag ? <ContainerDataMatrix /> : <ContainerElement />}
						</Box>
						<Box pt='xs'>
							<ToolbarTools />
						</Box>
					</Box>

					{import.meta.env.DEV && (
						<Box>
							<Button fullWidth onClick={() => storeApp.setJsonCodeFlag(true)}>
								JsonCode
							</Button>
						</Box>
					)}
				</Stack>
				<ScrollArea h='100%' p='xs' pt='0'>
					<Band>
						<Template />
					</Band>
				</ScrollArea>
				<Box
					h='100%'
					w='18rem'
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
							<Tabs.List
								pos='sticky'
								top={0}
								bg='var(--mantine-color-body)'
								style={{
									zIndex: 10,
								}}
							>
								<Tabs.Tab value='properties'>Свойства</Tabs.Tab>
								<Tabs.Tab value='layers'>Слои</Tabs.Tab>
								<Tabs.Tab value='histories'>История</Tabs.Tab>
							</Tabs.List>
							<Tabs.Panel keepMounted value='properties' p='0.5rem'>
								{storeTemplate.objects.length === 0 ? (
									<Text c='dimmed' size='xl'>
										Нет ни одного объекта
									</Text>
								) : storeTemplate.isChoosed() ? (
									<ListProperties />
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
		</ProvideGuideLine>
	)
})

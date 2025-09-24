import { Divider, Group, Tabs, Text } from '@mantine/core'

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
import { ToolbarHistory } from '../features/toolbars/history/toolbar-history'
import { ToolbarLabel } from '../features/toolbars/label/toolbar-label'
import { ToolbarRotate } from '../features/toolbars/rotate/toolbar-rotate'
import { ToolbarTemplate } from '../features/toolbars/template/toolbar-template'
import { ContainerVariable } from '../features/variables/container-variable'

import { Layout } from './Layout'

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
		<>
			<Group
				p='xs'
				justify='space-between'
				style={{
					borderBottom: '1px solid var(--mantine-color-default-border)',
				}}
			>
				<Group>
					<ToolbarRotate />
					<Divider orientation='vertical' />
					<ToolbarTemplate />
				</Group>
				<ToolbarLabel />
				<ToolbarHistory />
			</Group>
			<Layout
				leftSection={dataMatrixFlag ? <ContainerDataMatrix /> : <ContainerElement />}
				rightSection={
					fontFamilyFlag ? (
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
					)
				}
			>
				<Band>
					<Template />
				</Band>
			</Layout>
		</>
	)
})

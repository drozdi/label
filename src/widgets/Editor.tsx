import { ActionIcon, Divider, Group, Popover, Stack, Tabs, Text } from '@mantine/core'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { TbWallpaper } from 'react-icons/tb'
import { storeApp } from '../entites/app/store'
import { storeTemplate } from '../entites/template/store'
import { Band } from '../features/band/band'
import { DrawerDataMatrix } from '../features/data-matrix/drawer-data-matrix'
import { ContainerElement } from '../features/elements/container-element'
import { DrawerFontFamily } from '../features/fonts/drawer-font-family'
import { ListHistory } from '../features/history/list-history'
import { DrawerImage } from '../features/images/drawer-image'
import { ListLayers } from '../features/layers/list-layers'
import { ListProperties } from '../features/properties/list-properties'
import { Template } from '../features/template/template'
import { ToolbarGuideLine } from '../features/toolbars/grid-line/toolbar-grid-line'
import { ToolbarHistory } from '../features/toolbars/history/toolbar-history'
import { ToolbarLabel } from '../features/toolbars/label/toolbar-label'
import { ToolbarRotate } from '../features/toolbars/rotate/toolbar-rotate'
import { ToolbarTemplate } from '../features/toolbars/template/toolbar-template'
import { DrawerVariable } from '../features/variables/drawer-variable'

import { useDisclosure } from '@mantine/hooks'
import { useBreakpoint } from '../shared/hooks'
import { Layout } from './Layout'

export const Editor = observer(() => {
	const isMobile = useBreakpoint('xs')
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
	const [opened, { toggle }] = useDisclosure(false)

	const popever = (
		<>
			<ToolbarLabel />
			<ToolbarGuideLine as={isMobile ? Stack : Group} />
		</>
	)

	return (
		<>
			<Stack p='xs' pt='0'>
				<Group justify='space-between'>
					<Group gap='0.125rem'>
						<ToolbarRotate />
						<Divider orientation='vertical' />
						<ToolbarTemplate />
					</Group>
					{isMobile ? (
						<Popover opened={opened} onChange={toggle}>
							<Popover.Target>
								<ActionIcon color={opened ? 'lime' : ''} onClick={toggle}>
									<TbWallpaper />
								</ActionIcon>
							</Popover.Target>
							<Popover.Dropdown w='100%'>
								<Group justify='space-between'>{popever}</Group>
							</Popover.Dropdown>
						</Popover>
					) : (
						popever
					)}
					<ToolbarHistory />
				</Group>
			</Stack>
			<Layout
				leftSection={<ContainerElement />}
				rightSection={
					<Tabs defaultValue='properties' h='100%'>
						<Tabs.List>
							<Tabs.Tab value='properties'>Свойства</Tabs.Tab>
							<Tabs.Tab value='layers'>Слои</Tabs.Tab>
							{storeApp.historyCount > 0 && <Tabs.Tab value='histories'>История</Tabs.Tab>}
						</Tabs.List>
						<Tabs.Panel value='properties'>
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
						<Tabs.Panel value='layers'>
							{storeTemplate.objects.length === 0 ? (
								<Text c='dimmed' size='xl'>
									Нет ни одного объекта
								</Text>
							) : (
								<ListLayers />
							)}
						</Tabs.Panel>
						<Tabs.Panel value='histories'>
							<ListHistory />
						</Tabs.Panel>
					</Tabs>
				}
			>
				<Band>
					<Template />
				</Band>
			</Layout>
			<DrawerDataMatrix />
			<DrawerFontFamily />
			<DrawerVariable />
			<DrawerImage />
		</>
	)
})

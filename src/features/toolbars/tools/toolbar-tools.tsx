import { ActionIcon, Popover, Slider, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { TbBackground, TbZoom } from 'react-icons/tb'
import { storeTemplate } from '../../../entites/template/store'

export const ToolbarTools = observer(() => {
	const [opened, { close, open }] = useDisclosure(false)
	return (
		<Stack align='center' justify='flex-start'>
			<Popover
				width={300}
				position='bottom'
				shadow='md'
				position='right'
				offset={0}
				opened={opened}
			>
				<Popover.Target>
					<ActionIcon onMouseEnter={open} onMouseLeave={close}>
						<TbZoom />
					</ActionIcon>
				</Popover.Target>
				<Popover.Dropdown onMouseEnter={open} onMouseLeave={close}>
					<Slider
						min={1}
						max={2}
						step={0.01}
						defaultValue={storeTemplate.scale}
						onChange={value => storeTemplate.setScale(value)}
					/>
				</Popover.Dropdown>
			</Popover>
			<ActionIcon>
				<TbBackground />
			</ActionIcon>
		</Stack>
	)
})

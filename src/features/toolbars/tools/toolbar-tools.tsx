import { ActionIcon, FileButton, Popover, Slider, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import {
	TbArrowBack,
	TbArrowForward,
	TbBackground,
	TbGrid3X3,
	TbZoom,
} from 'react-icons/tb'
import { storeHistory } from '../../../entites/history/store'
import { storeTemplate } from '../../../entites/template/store'
import { useAppContext } from '../../context'

const allowedExtensions = ['bmp', 'jpeg', 'png']

export const ToolbarTools = observer(() => {
	const ctx = useAppContext()
	const { gridFlag, imageBg } = ctx
	const [opened, { close, open }] = useDisclosure(false)

	const selectedBG = file => {
		const allowedExtensions = ['bmp', 'jpeg', 'png']
		if (!allowedExtensions.map(item => 'image/' + item).includes(file.type)) {
			return alert(
				'Вы пытаетесь добавить файл ' +
					file.type +
					`. Вы можете загрузить только изображение с расширение .${allowedExtensions.join(
						', .'
					)}`
			)
		}
		const reader = new FileReader()
		reader.onload = () => {
			ctx.setImageBg(reader.result)
		}
		reader.readAsDataURL(file)
	}
	return (
		<Stack align='center' justify='flex-start' maw='none'>
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
						max={4}
						step={0.01}
						label={value => `${Math.round(value * 100)}`}
						defaultValue={storeTemplate.scale}
						marks={[
							{ value: 2, label: '200%' },
							{ value: 3, label: '300%' },
							{ value: 4, label: '400%' },
						]}
						onChange={value =>
							storeTemplate.setScale(Math.round(value * 100) / 100)
						}
					/>
					<br />
				</Popover.Dropdown>
			</Popover>
			<FileButton
				onChange={selectedBG}
				accept={allowedExtensions.map(ext => 'image/' + ext).join(', ')}
			>
				{props => (
					<ActionIcon
						{...props}
						onClick={() => {
							ctx.setImageBg('')
							props.onClick()
						}}
						color={imageBg ? 'lime' : ''}
						title='Загрузить фон'
					>
						<TbBackground />
					</ActionIcon>
				)}
			</FileButton>
			<ActionIcon
				color={gridFlag ? 'lime' : ''}
				title='Сетка разметки'
				onClick={() => ctx.setGridFlag(v => !v)}
			>
				<TbGrid3X3 />
			</ActionIcon>
			<br />
			<ActionIcon
				title='Назад'
				disabled={storeHistory.canGoBack}
				onClick={() => storeHistory.back()}
			>
				<TbArrowBack />
			</ActionIcon>
			<ActionIcon
				title='Вперед'
				disabled={storeHistory.canGoForward}
				onClick={() => storeHistory.forward()}
			>
				<TbArrowForward />
			</ActionIcon>
		</Stack>
	)
})

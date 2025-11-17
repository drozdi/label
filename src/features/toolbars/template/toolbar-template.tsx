import { ActionIcon, FileButton, Popover, Slider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { TbBackground, TbGrid3X3, TbZoomIn } from 'react-icons/tb'
import { storeApp } from '../../../entites/app/store'
import { storeTemplate } from '../../../entites/template/store'
import { Toolbar } from '../../../shared/ui'

const allowedExtensions = ['bmp', 'jpeg', 'png']

export const ToolbarTemplate = observer(({ disabled, ...props }: { disabled?: boolean; [key: string]: any }) => {
	const { gridFlag, imageBg } = storeApp
	const [opened, { close, open }] = useDisclosure(false)

	const selectedBG = file => {
		const allowedExtensions = ['bmp', 'jpeg', 'png']
		if (!allowedExtensions.map(item => 'image/' + item).includes(file.type)) {
			return alert(
				'Вы пытаетесь добавить файл ' +
					file.type +
					`. Вы можете загрузить только изображение с расширение .${allowedExtensions.join(', .')}`
			)
		}
		const reader = new FileReader()
		reader.onload = () => {
			storeApp.setImageBg(reader.result)
		}
		reader.readAsDataURL(file)
	}
	const chandeScale = useCallback(event => {
		const delta = event.deltaY || event.detail || event.wheelDelta
		event.preventDefault()
		event.stopPropagation()
		if (delta < 0) {
			if (storeTemplate.scale < 4) {
				storeTemplate.setScale(storeTemplate.scale + (event.shiftKey ? 0.01 : 0.1))
			}
		} else if (delta > 0) {
			if (storeTemplate.scale > 1) {
				storeTemplate.setScale(storeTemplate.scale - (event.shiftKey ? 0.01 : 0.1))
			}
		}
	}, [])

	return (
		<Toolbar {...props}>
			<Popover disabled={disabled} width={300} shadow='md' offset={0} opened={opened}>
				<Popover.Target>
					<ActionIcon onMouseEnter={open} onMouseLeave={close}>
						<TbZoomIn />
					</ActionIcon>
				</Popover.Target>
				<Popover.Dropdown onWheel={chandeScale} onMouseEnter={open} onMouseLeave={close}>
					<Slider
						min={1}
						max={4}
						step={0.01}
						label={value => `${Math.round(value * 100)}`}
						value={storeTemplate.scale}
						marks={[
							{ value: 1, label: '100%' },
							{ value: 2, label: '200%' },
							{ value: 3, label: '300%' },
							{ value: 4, label: '400%' },
						]}
						onChange={value => {
							storeTemplate.setScale(Math.round(value * 100) / 100)
						}}
					/>
					<br />
				</Popover.Dropdown>
			</Popover>
			<FileButton
				disabled={disabled}
				onChange={selectedBG}
				accept={allowedExtensions.map(ext => 'image/' + ext).join(', ')}
			>
				{props => (
					<ActionIcon
						{...props}
						onClick={() => {
							storeApp.setImageBg('')
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
				disabled={disabled}
				color={gridFlag ? 'lime' : ''}
				title='Сетка разметки'
				onClick={() => storeApp.setGridFlag(!gridFlag)}
			>
				<TbGrid3X3 />
			</ActionIcon>
		</Toolbar>
	)
})

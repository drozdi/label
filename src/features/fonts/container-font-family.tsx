import {
	ActionIcon,
	Button,
	CloseButton,
	FileButton,
	Group,
	ScrollArea,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { TbFilePlus } from 'react-icons/tb'
import { storeFonts } from '../../entites/fonts/store'
import { serviceNotifications } from '../../entites/notifications/service'
import { useAppContext } from '../context'
import { ListFontFamily } from './list-font-family'

export const ContainerFontFamily = observer(() => {
	const [file, setFile] = useState<any>(null)
	const [name, setName] = useState('')
	const ctx = useAppContext()

	const handleFile = file => {
		const name = file.name
		if (!name.toLowerCase().match(/\.ttf$/g)) {
			serviceNotifications.error('Необходимо загрузить файл с разрешением ttf')
			return
		}
		setName(name.replace(/(\.)|(...$)/g, ''))
		setFile(file)
	}
	const writeName = ({ target }) => {
		setName(
			target.value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, '')
		)
	}
	const handleSave = () => {
		const reader = new FileReader()
		reader.onload = async () => {
			await storeFonts.add(
				name,
				reader.result.replace(/data:application\/.*;base64,/g, '')
			)

			setFile(null)
			setName('')
		}
		reader.readAsDataURL(file)
	}
	const handleCancel = () => {
		setFile(null)
	}
	const handleClose = () => {
		ctx?.setFontFamilyFlag(false)
	}

	return (
		<Stack h='100%'>
			<Group justify='space-between'>
				Шрифты
				<CloseButton onClick={handleClose} />
			</Group>
			{file ? (
				<Stack>
					<Text size='xs'>
						Загружен шрифт "{file?.name || 'unknow'}". Оставьте текущее название
						или введите своё на латинице. Максимум 8 символов
					</Text>
					<TextInput value={name} onChange={writeName} required />
					<Group justify='space-between'>
						<Button onClick={handleSave}>Сохранить</Button>
						<Button onClick={handleCancel}>Отмена</Button>
					</Group>
				</Stack>
			) : (
				<FileButton onChange={handleFile} accept='.ttf'>
					{props => (
						<Group justify='space-between'>
							Загрузить
							<ActionIcon {...props}>
								<TbFilePlus size='1.5em' />
							</ActionIcon>
						</Group>
					)}
				</FileButton>
			)}{' '}
			<ScrollArea h='100%'>
				<ListFontFamily />
			</ScrollArea>
		</Stack>
	)
})

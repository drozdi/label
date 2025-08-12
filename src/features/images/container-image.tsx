import {
	ActionIcon,
	Button,
	CloseButton,
	FileButton,
	Group,
	Image,
	ScrollArea,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { TbFilePlus } from 'react-icons/tb'
import { storeImages } from '../../entites/images/store'
import { serviceNotifications } from '../../entites/notifications/service'
import { useAppContext } from '../context'
import { ListImage } from './list-image'

export const ContainerImage = observer(() => {
	const [file, setFile] = useState<any>(null)
	const [image, setImage] = useState<any>(null)
	const [name, setName] = useState('')
	const ctx = useAppContext()
	const handleClose = () => {
		ctx?.setImageFlag(false)
	}
	const handleFile = (file: any) => {
		const name = file.name

		if (file.type !== 'image/bmp') {
			serviceNotifications.error(
				`Вы пытаетесь добавить файл ${file.type}. Вы можете загрузить только изображение с форматом .bmp`
			)
			return
		}
		if (file.size > 512000) {
			serviceNotifications.error(
				'Превышен максимальный размер файла. Максимальный разрешённый размер 515 Кб'
			)
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			setImage(reader.result.replace(/data:image\/bmp;base64,/g, ''))
		}
		reader.readAsDataURL(file)

		setName(name.replace(/(\.)|(...$)/g, ''))
		setFile(file)
	}
	const handleSave = async () => {
		await storeImages.add(name, image)
		setImage(null)
		setFile(null)
		setName('')
	}
	const handleCancel = () => {
		setFile(null)
	}
	const writeName = ({ target }) => {
		setName(
			target.value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, '')
		)
	}
	return (
		<Stack h='100%'>
			<Group justify='space-between'>
				Изображения
				<CloseButton onClick={handleClose} />
			</Group>
			{file ? (
				<>
					<Stack>
						<Title order={6} ta='center'>
							Предпросмотр
						</Title>
						<Image src={'data:image/bmp;base64,' + image} />
						<Text size='xs'>
							Загружен файл "{file?.name || 'unknow'}". Оставьте текущее
							название или введите своё на латинице. Максимум 8 символов
						</Text>
						<TextInput value={name} onChange={writeName} required />
						<Group justify='space-between'>
							<Button variant='filled' onClick={handleSave}>
								Сохранить
							</Button>
							<Button variant='filled' onClick={handleCancel}>
								Отмена
							</Button>
						</Group>
					</Stack>
				</>
			) : (
				<FileButton onChange={handleFile} accept='.bmp'>
					{props => (
						<Group justify='space-between'>
							Загрузить
							<ActionIcon {...props}>
								<TbFilePlus size='1.5em' />
							</ActionIcon>
						</Group>
					)}
				</FileButton>
			)}
			<ScrollArea h='100%'>
				<ListImage />
			</ScrollArea>
		</Stack>
	)
})

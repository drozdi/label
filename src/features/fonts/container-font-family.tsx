import {
	Box,
	Button,
	CloseButton,
	FileButton,
	Group,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeFonts } from '../../entites/fonts/store'
import { useAppContext } from '../context'
import { ListFontFamily } from './list-font-family'

export const ContainerFontFamily = observer(() => {
	const [font, setFont] = useState<any>(null)
	const [fontName, setFontName] = useState('')
	const ctx = useAppContext()

	const handleFile = file => {
		const name = file.name
		if (!name.toLowerCase().match(/\.ttf$/g)) {
			alert('Необходимо загрузить файл с разрешением ttf')
			return
		}
		setFontName(name.replace(/(\.)|(...$)/g, ''))
		setFont(file)
	}
	const writeName = (value: string) => {
		setFontName(value.replace(/[!@#№%^:$&?*()_\-=+<>\.,;:а-яёйА-ЯЁЙ\s]/g, ''))
	}
	const handleSave = () => {
		const reader = new FileReader()
		reader.onload = async () => {
			await storeFonts.add(
				fontName,
				reader.result.replace(/data:application\/.*;base64,/g, '')
			)

			setFont(null)
			setFontName('')
		}
		reader.readAsDataURL(font)
	}
	const handleCancel = () => {
		setFont(null)
	}
	const handleClose = () => {
		ctx?.setFontFamilyFlag(false)
	}

	return (
		<Stack>
			<Group justify='space-between'>
				Шрифты
				<CloseButton onClick={handleClose} />
			</Group>
			{font ? (
				<Stack>
					<Box>
						{' '}
						Загружен шрифт "{font?.name || 'unknow'}". Оставьте текущее название
						или введите своё на латинице. Максимум 8 символов
					</Box>
					<TextInput value={fontName} onChange={writeName} required />
					<Group justify='space-between'>
						<Button onClick={handleSave}>Сохранить</Button>
						<Button onClick={handleCancel}>Отмена</Button>
					</Group>
				</Stack>
			) : (
				<FileButton onChange={handleFile}>
					{props => (
						<Group justify='space-between'>
							Загрузить
							<Button
								{...props}
								size='xs'
								variant='outline'
								style={{
									paddingLeft: '0.25em',
									paddingRight: '0.25em',
								}}
							>
								<Text
									style={{
										fontSize: '3em',
										marginTop: '-0.15em',
									}}
								>
									+
								</Text>
							</Button>
						</Group>
					)}
				</FileButton>
			)}{' '}
			<ListFontFamily />
		</Stack>
	)
})

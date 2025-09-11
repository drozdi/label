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
import { TbFilePlus } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { useImagesUpload } from './hooks/use-images-upload'
import { ListImage } from './list-image'

export const ContainerImage = observer(() => {
	const { file, image, name, upload, cancel, save, writeName } =
		useImagesUpload()

	return (
		<Stack h='100%'>
			<Group mt='xs' justify='space-between'>
				Изображения
				<CloseButton onClick={() => storeApp?.setImageFlag(false)} />
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
						<TextInput
							value={name}
							onChange={({ target }) => writeName(target.value)}
							required
						/>
						<Group justify='space-between'>
							<Button variant='filled' onClick={save}>
								Сохранить
							</Button>
							<Button variant='filled' onClick={cancel}>
								Отмена
							</Button>
						</Group>
					</Stack>
				</>
			) : (
				<FileButton onChange={upload} accept='.bmp'>
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

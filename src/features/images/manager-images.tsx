import {
	Button,
	FileButton,
	Group,
	Image,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { Item } from '../../shared/ui'
import { useImagesUpload } from './hooks/use-images-upload'

export const ManagerImages = observer(() => {
	const { file, name, save, cancel, upload, writeName } = useImagesUpload()
	const { managerImagesFlag } = storeApp
	const { list } = storeImages
	const handleClick = (id: number) => storeImages.setId(id)
	const handleClose = () => {
		storeApp.setManagerImagesFlag(false)
		cancel()
	}
	const handleRemove = async (id: number) => {
		await storeImages.remove(id)
	}
	return (
		<Stack>
			<Group justify='space-between'>
				<Text>
					Изображения по умолчанию "
					<span
						style={{
							fontFamily: storeFonts.default?.name,
						}}
					>
						{storeFonts.default?.name}
					</span>
					"
				</Text>
				<Group justify='flex-end'>
					<FileButton onChange={upload} accept='.bmp'>
						{props => (
							<Button {...props} variant='filled' color='green'>
								Загрузить
							</Button>
						)}
					</FileButton>
					<Button variant='default' onClick={handleClose}>
						Закрыть
					</Button>
				</Group>
			</Group>

			{file && (
				<Stack gap={0}>
					<Text size='xs'>
						Загружен файл "{file?.name || 'unknow'}". Оставьте текущее название
						или введите своё на латинице. Максимум 8 символов
					</Text>
					<TextInput
						value={name}
						onChange={({ target }) => writeName(target.value)}
						required
					/>
					<Group justify='space-between'>
						<Button onClick={save}>Сохранить</Button>
						<Button onClick={cancel}>Отмена</Button>
					</Group>
				</Stack>
			)}

			<SimpleGrid cols={6}>
				{list.map(image => (
					<Item
						key={image.id}
						active={storeImages.id === image.id}
						onClick={() => handleClick(image.id)}
						onRemove={() => handleRemove(image.id)}
					>
						<Image
							src={'data:image/bmp;base64,' + image.data}
							alt={image.tag_images}
						/>
						<Title ta='center' order={6}>
							{image.name}
						</Title>
					</Item>
				))}
			</SimpleGrid>
		</Stack>
	)
})

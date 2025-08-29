import {
	Button,
	FileButton,
	Group,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
} from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeFonts } from '../../entites/fonts/store'
import { Item } from '../../shared/ui'
import { useAppContext } from '../context'
import { useFontsUpload } from './hooks/use-fonts-upload'

export const ManagerFontFamily = observer(() => {
	const ctx = useAppContext()
	const { file, name, save, cancel, upload, writeName } = useFontsUpload()
	const { managerFontFamilyFlag } = ctx
	const { list } = storeFonts
	const handleClick = (id: number) => storeFonts.setId(id)
	const handleClose = () => {
		ctx.setManagerFontFamilyFlag(false)
		cancel()
	}
	const handleRemove = async (id: number) => {
		await storeFonts.remove(id)
	}
	return (
		<Stack>
			<Group justify='space-between'>
				<Text>
					Шрифт по умолчанию "
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
					<FileButton onChange={upload} accept='.ttf'>
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
						Загружен шрифт "{file?.name || 'unknow'}". Оставьте текущее название
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

			<SimpleGrid cols={3}>
				{list.map(font => (
					<Item
						key={font.id}
						active={storeFonts.id === font.id}
						style={{ fontFamily: font.name }}
						onClick={() => handleClick(font.id)}
						onRemove={() => handleRemove(font.id)}
					>
						<span style={{ fontSize: '0.85em' }}>{font.name}</span>
						<br /> Это образец шрифта
						<br /> This is a sample font
						<br /> 0123456789
					</Item>
				))}
			</SimpleGrid>
		</Stack>
	)
})

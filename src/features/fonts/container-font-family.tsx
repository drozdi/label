import { ActionIcon, Button, FileButton, Group, Stack, Text, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbFilePlus } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { Container } from '../../shared/ui'
import { useFontsUpload } from './hooks/use-fonts-upload'
import { ListFontFamily } from './list-font-family'

export const ContainerFontFamily = observer(() => {
	const { name, file, save, cancel, upload, writeName } = useFontsUpload()
	return (
		<Container label='Шрифты' p='xs' onClose={() => storeApp?.setFontFamilyFlag(false)}>
			{file ? (
				<Stack>
					<Text size='xs'>
						Загружен шрифт "{file?.name || 'unknow'}". Оставьте текущее название или введите своё на латинице. Максимум
						8 символов
					</Text>
					<TextInput value={name} onChange={({ target }) => writeName(target.value)} required />
					<Group justify='space-between'>
						<Button onClick={save}>Сохранить</Button>
						<Button onClick={cancel}>Отмена</Button>
					</Group>
				</Stack>
			) : (
				<FileButton onChange={upload} accept='.ttf'>
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
			<ListFontFamily />
		</Container>
	)
})

import { ActionIcon, Box, Button, Group, Stack, TextInput, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { observer } from 'mobx-react-lite'
import { TbNewSection } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { serviceTemplate } from '../../services/template/service'
import { Header } from '../../shared/ui'

export const HeaderMain = observer(() => {
	const history = useHistory()
	const newTemplate = async () => {
		storeTemplate.clear()
		history.clear()
		await serviceTemplate.newName()
		storeTemplate.setTemplateName(await serviceTemplate.newName())
		storeApp.setErrorName(false)
	}
	const theme = useMantineTheme()
	const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

	return (
		<Header>
			<TextInput
				placeholder='Название'
				value={storeTemplate.name}
				error={storeApp.errorName}
				onChange={({ target }) => {
					storeApp.setErrorName(false)
					storeTemplate.setTemplateName(target.value)
				}}
				leftSection={
					<ActionIcon radius='0' onClick={newTemplate} title='Создать'>
						<TbNewSection>Создать</TbNewSection>
					</ActionIcon>
				}
				rightSection={
					<ActionIcon radius='0' color='green' onClick={() => serviceTemplate.handleSave()} title='Сохранить'>
						Ok
					</ActionIcon>
				}
				w={isMobile ? '100%' : ''}
			/>
			<Box component={isMobile ? Stack : Group} align='stretch' w={isMobile ? '100%' : ''}>
				<Button
					variant='outline'
					onClick={() => {
						storeTemplate.clear(false)
						history.append(storeTemplate.objects, 'Очистка')
					}}
				>
					Очистить
				</Button>
				<Button variant='outline' onClick={() => storeApp?.setLoadTemplateFlag(true)}>
					Шаблоны
				</Button>
				<Button
					variant='outline'
					color={storeApp.previewFlag ? 'lime' : ''}
					onClick={() => storeApp?.setPreviewFlag?.(!storeApp.previewFlag)}
				>
					Предпросмотр
				</Button>
			</Box>
		</Header>
	)
})

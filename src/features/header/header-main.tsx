import { ActionIcon, Box, Button, Group, Stack, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { TbNewSection } from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { serviceTemplate } from '../../services/template/service'
import { useBreakpoint } from '../../shared/hooks'
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
	const isMobile = useBreakpoint('xs')

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
						storeApp.setHeaderMobileFlag(false)
					}}
				>
					Очистить
				</Button>
				<Button
					variant='outline'
					onClick={() => {
						storeApp.setLoadTemplateFlag(true)
						storeApp.setHeaderMobileFlag(false)
					}}
				>
					Шаблоны
				</Button>
				<Button
					variant='outline'
					color={storeApp.previewFlag ? 'lime' : ''}
					onClick={() => {
						storeApp.setPreviewFlag(!storeApp.previewFlag)
						storeApp.setHeaderMobileFlag(false)
					}}
				>
					Предпросмотр
				</Button>
			</Box>
		</Header>
	)
})

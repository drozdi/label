import { ActionIcon, Button, Group } from '@mantine/core'
import { TbSettings } from 'react-icons/tb'
import { storeTemplate } from '../entites/template/store'
import { useAppContext } from '../features/context'
import { HeaderMain } from '../features/header/header-main'
import { HeaderTemplates } from '../features/header/header-templates'

export function Header() {
	const ctx = useAppContext()
	const { loadTemplateFlag, settingsFlag } = ctx
	return (
		<Group justify='space-between'>
			{loadTemplateFlag ? <HeaderTemplates /> : <HeaderMain />}
			<Group>
				<ActionIcon color={settingsFlag? 'lime': ''} onClick={() => ctx.setSettingsFlag(!settingsFlag)}>
					<TbSettings />
				</ActionIcon>
				<Button
					onClick={() =>
						console.log({
							...storeTemplate,
							objects: [...storeTemplate.objects],
						})
					}
				>
					check
				</Button>
			</Group>
		</Group>
	)
}

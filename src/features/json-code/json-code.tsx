import { Button, Group, JsonInput, Modal, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { DEF_TEMPLATE } from '../../shared/constants'
import { genId } from '../../shared/utils'

export const JsonCode = observer(() => {
	const refText = useRef<HTMLElement>(null)
	const [value, setValue] = useState('')
	function handleImport() {
		storeTemplate.clear()
		const parse = {
			...JSON.parse(refText.current.value),
			id: undefined,
		}
		storeTemplate.loadTemplate({
			...parse,
			objects: parse.objects.map(item => ({
				...item,
				id: genId(),
			})),
		})
		storeApp.setJsonCodeFlag(false)
	}
	function handleExport() {
		refText.current.value = JSON.stringify({
			...DEF_TEMPLATE,
			...storeTemplate,
			objects: storeTemplate.objects.map(item => item.getProps()),
			id: undefined,
			scale: undefined,
			dpi: undefined,
			mm: undefined,
			cm: undefined,
			mm_qr: undefined,
			selected: undefined,
		})
	}
	return (
		<Modal opened={storeApp.jsonCodeFlag} onClose={() => storeApp.setJsonCodeFlag(false)} size='xl'>
			<Stack>
				<JsonInput rows={20} ref={refText} />
				<Group>
					<Button variant='filled' onClick={handleImport}>
						Импорт
					</Button>
					<Button variant='filled' onClick={handleExport}>
						Экспорт
					</Button>
					<Button variant='filled' onClick={() => storeApp.setJsonCodeFlag(false)}>
						Закрыть
					</Button>
				</Group>
			</Stack>
		</Modal>
	)
})

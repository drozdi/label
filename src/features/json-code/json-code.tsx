import { Button, Group, Modal, Stack, Textarea } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { DEF_TEMPLATE } from '../../shared/constants'
import { genId } from '../../shared/utils'
import { useAppContext } from '../context'

export const JsonCode = observer(() => {
	const ctx = useAppContext()
	const refText = useRef()
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
		ctx.setJsonCodeFlag(false)
	}
	function handleExport() {
		refText.current.value = JSON.stringify({
			...DEF_TEMPLATE,
			...storeTemplate,
			objects: storeTemplate.objects.map(item => ({
				...item.getProps(),
			})),
			id: undefined,
			scale: undefined,
			dpi: undefined,
			mm: undefined,
			cm: undefined,
			mm_qr: undefined,
			currId: undefined,
			currIndex: undefined,
			selected: undefined,
		})
	}
	return (
		<Modal
			opened={ctx.jsonCodeFlag}
			onClose={() => ctx.setJsonCodeFlag(false)}
			size='xl'
		>
			<Stack>
				<Textarea rows={20} ref={refText} />

				<Group>
					<Button variant='filled' onClick={handleImport}>
						Импорт
					</Button>
					<Button variant='filled' onClick={handleExport}>
						Экспорт
					</Button>
					<Button variant='filled' onClick={() => ctx.setJsonCodeFlag(false)}>
						Закрыть
					</Button>
				</Group>
			</Stack>
		</Modal>
	)
})

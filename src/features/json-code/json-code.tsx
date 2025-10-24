import { JsonInput, Modal } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useRef } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { DEF_TEMPLATE } from '../../shared/constants'

export const JsonCode = observer(() => {
	const refText = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (storeApp.jsonCodeFlag) {
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
	}, [storeApp.jsonCodeFlag])

	return (
		<Modal
			title='JSON Code'
			opened={storeApp.jsonCodeFlag}
			onClose={() => storeApp.setJsonCodeFlag(false)}
			size='xl'
			closeOnClickOutside={false}
			keepMounted
		>
			<JsonInput formatOnBlur rows={30} ref={refText} />
		</Modal>
	)
})

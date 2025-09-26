import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeFonts } from '../../entites/fonts/store'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'

import { Item } from '../../shared/ui'

export const ItemFontFamily = observer(({ font }) => {
	const current = storeTemplate.current
	const history = useHistory()
	const [oldId] = useState(current?.font_id)
	const handleMouseOver = () => {
		storeTemplate.setFontId(font.id)
	}
	const handleMouseOut = () => {
		storeTemplate.setFontId(oldId)
	}
	const handleSelect = () => {
		storeTemplate.setFontId(font.id)
		history.append(storeTemplate.objects, `Шрифт "${current?.name}" - ${storeFonts.findById(font.id)?.name}`)
		storeApp?.setFontFamilyFlag(false)
	}
	return (
		<Item
			active={oldId === font.id}
			style={{ fontFamily: font.name }}
			onClick={handleSelect}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
		>
			<span style={{ fontSize: '0.85em' }}>{font.name}</span>
			<br /> Это образец шрифта
			<br /> This is a sample font
			<br /> 0123456789
		</Item>
	)
})

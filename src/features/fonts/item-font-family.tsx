import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeFonts } from '../../entites/fonts/store'
import { histroyAppend } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import styles from './Item.module.css'

export const ItemFontFamily = observer(({ font }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const [oldId, setOldId] = useState(current?.font_id)
	const handleMouseOver = () => {
		storeTemplate.setFontId(font.id)
	}
	const handleMouseOut = () => {
		storeTemplate.setFontId(oldId)
	}
	const handleSelect = () => {
		storeTemplate.setFontId(font.id)
		histroyAppend(
			storeTemplate.objects,
			`Шрифт "${current?.name}" - ${storeFonts.findById(font.id)?.name}`
		)
		ctx?.setFontFamilyFlag(false)
	}
	return (
		<div
			className={styles.root + (oldId === font.id ? ' ' + styles.active : '')}
			style={{ fontFamily: font.name }}
			onClick={handleSelect}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
		>
			<span style={{ fontSize: '0.85em' }}>{font.name}</span>
			<br /> Это образец шрифта
			<br /> This is a sample font
			<br /> 0123456789
		</div>
	)
})

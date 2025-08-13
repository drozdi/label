import { observer } from 'mobx-react-lite'
import { useMemo, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import styles from './Element.module.css'

export const Element = observer(
	({ object, index, preview }: { object: object; index: number }) => {
		const refParent = useRef<HTMLDivElement>(null)
		const ctx = useAppContext()
		const style = useMemo(
			() => ({
				...object.style(refParent.current),
				...(preview ? { border: '0px' } : {}),
			}),
			[object, refParent.current]
		)
		const handleClick = (event: React.MouseEvent) => {
			if (preview) {
				return
			}
			const element = event.target.closest(`.${styles.element}`)
			event.stopPropagation()

			if (event.ctrlKey) {
				storeTemplate.selectObject(element.id)
			} else {
				if (element instanceof HTMLDivElement) {
					storeTemplate.setActiveObject(element.id)
				}
			}

			ctx?.setFontFamilyFlag(false)
			ctx?.setVariableFlag(false)
			ctx?.setImageFlag(false)
		}
		return (
			<div
				id={object.id}
				style={style}
				ref={refParent}
				className={
					styles.element +
					(storeTemplate.selected.includes(String(object.id))
						? ' ' + styles.active
						: '')
				}
				onClick={handleClick}
				draggable={!preview}
			>
				{object.render(1, preview)}
			</div>
		)
	}
)

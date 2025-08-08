import { observer } from 'mobx-react-lite'
import { useMemo, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import styles from './Element.module.css'

export const Element = observer(
	({ object, index }: { object: object; index: number }) => {
		const refParent = useRef<HTMLDivElement>(null)
		const ctx = useAppContext()
		const style = useMemo(
			() => ({
				...object.style(refParent.current),
			}),
			[object, refParent.current]
		)
		const handleClick = (event: React.MouseEvent) => {
			const element = event.target.closest(`.${styles.element}`)
			event.stopPropagation()
			//event.preventDefault()
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
					(storeTemplate.selected.includes(object.id)
						? ' ' + styles.active
						: '')
				}
				onClick={handleClick}
			>
				{object.render()}
			</div>
		)
	}
)

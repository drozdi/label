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
			event.stopPropagation()
			if (event.ctrlKey) {
				storeTemplate.selectObject(parseInt(event.target.id, 10))
			} else {
				if (event.target instanceof HTMLDivElement) {
					storeTemplate.setActiveObject(parseInt(event.target.id, 10))
				}
			}

			ctx?.setFontFamilyFlag(false)
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

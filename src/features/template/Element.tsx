import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { minMax } from '../../shared/utils'
import { useAppContext } from '../context'
import classes from './Element.module.css'

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
			const element = event.target.closest(`.${classes.element}`)
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

		const resize = object.resize
		const sPosition = useRef(null)
		const handleMouseDown = (
			event: React.MouseEvent,
			dir: 's' | 'e' | 'se'
		) => {
			event.preventDefault()
			event.stopPropagation()
			const element = event.target.closest(`.${classes.element}`)
			if (element instanceof HTMLDivElement) {
				storeTemplate.setActiveObject(element.id)
			}
			const elementRect = element.getBoundingClientRect()
			const parentRect = element.parentNode.getBoundingClientRect()
			sPosition.current = {
				pl: parentRect.left,
				pr: parentRect.right,
				pt: parentRect.top,
				pb: parentRect.bottom,
				el: elementRect.left,
				er: elementRect.right,
				et: elementRect.top,
				eb: elementRect.bottom,
				x: event.clientX,
				y: event.clientY,
				dir,
			}
		}
		const handleMouseMove = (event: React.MouseEvent) => {
			if (!sPosition.current) {
				return
			}
			event.preventDefault()
			event.stopPropagation()
		}
		const handleMouseUp = (event: React.MouseEvent) => {
			if (!sPosition.current) {
				return
			}
			
			event.preventDefault()
			event.stopPropagation()

			const dx = minMax(minMax(
				event.clientX,
				sPosition.current.el,
				sPosition.current.pr
			) - sPosition.current.x - 4, 0)
			const dy = minMax(minMax(
				event.clientY,
				sPosition.current.et,
				sPosition.current.pb
			) - sPosition.current.y - 4, 0)

			if (sPosition.current?.dir === 'e' || sPosition.current?.dir === 'se') {
				storeTemplate.setWidth(
					minMax(storeTemplate.current.width + dx / storeTemplate.mm, 0.1)
				)
			}

			if (sPosition.current?.dir === 's' || sPosition.current?.dir === 'se') {
				storeTemplate.setHeight(
					minMax(storeTemplate.current.height + dy / storeTemplate.mm, 0.1)
				)
			}
			sPosition.current = null
		}
		useEffect(() => {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
			return () => {
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
			}
		}, [])

		return (
			<div
				id={object.id}
				style={style}
				ref={refParent}
				className={
					classes.element +
					(storeTemplate.selected.includes(String(object.id))
						? ' ' + classes.active
						: '')
				}
				onClick={handleClick}
				draggable={!preview}
			>
				{object.render(storeTemplate.scale, preview)}
				{resize.map(dir => (
					<div
						key={dir}
						onMouseDown={e => handleMouseDown(e, dir)}
						className={`${classes.res} ${classes['res_' + dir]}`}
					></div>
				))}
			</div>
		)
	}
)

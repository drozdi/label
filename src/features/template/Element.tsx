import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { minMax } from '../../shared/utils'
import { useAppContext } from '../context'
import classes from './Element.module.css'

function aspect(width: number, height: number): number {
	return width / height
}

export const Element = observer(
	({
		object,
		index,
		preview,
	}: {
		object: object
		index: number
		preview: boolean
	}) => {
		const refParent = useRef<HTMLDivElement>(null)
		const ctx = useAppContext()
		const style = useMemo(
			() => ({
				...object.style(refParent.current),
				...(preview ? { outline: '0px' } : {}),
			}),
			[object, refParent.current]
		)
		const handleClick = (event: React.MouseEvent) => {
			if (preview) {
				return
			}
			const element = event.target.closest(`.${classes.element}`)
			if (element instanceof HTMLDivElement) {
				event.preventDefault()
				event.stopPropagation()
			}

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
		const cloneElement = useRef(null)

		const handleMouseDown = (
			event: React.MouseEvent,
			dir: 's' | 'e' | 'se'
		) => {
			if (preview) {
				return
			}
			const element = event.target.closest(`.${classes.element}`)
			if (element instanceof HTMLDivElement) {
				event.preventDefault()
				event.stopPropagation()
				storeTemplate.setActiveObject(element.id)
			}
			const elementRect = element.getBoundingClientRect()
			const parentRect = element.parentNode.getBoundingClientRect()
			cloneElement.current = element.cloneNode(true)
			cloneElement.current?.classList?.add?.(classes.clone)
			element.parentNode.appendChild(cloneElement.current)
			sPosition.current = {
				minX: elementRect.left + 2,
				maxX: parentRect.right - 2,
				minY: elementRect.top + 2,
				maxY: parentRect.bottom - 2,
				width: elementRect.width,
				height: elementRect.height,
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

			const a = aspect(sPosition.current.width, sPosition.current.height)
			let dx = 0,
				dy = 0

			if (sPosition.current?.dir === 'e') {
				dx =
					minMax(
						event.clientX,
						sPosition.current.minX,
						sPosition.current.maxX
					) - sPosition.current.x
				if (event.shiftKey && resize.includes('se')) {
					dy = dx * a
				}
			} else if (sPosition.current?.dir === 's') {
				dy =
					minMax(
						event.clientY,
						sPosition.current.minY,
						sPosition.current.maxY
					) - sPosition.current.y
				if (event.shiftKey && resize.includes('se')) {
					dx = dy / a
				}
			} else if (sPosition.current?.dir === 'se') {
				dx =
					minMax(
						event.clientX,
						sPosition.current.minX,
						sPosition.current.maxX
					) - sPosition.current.x
				dy = event.shiftKey
					? dx * a
					: minMax(
							event.clientY,
							sPosition.current.minY,
							sPosition.current.maxY
					  ) - sPosition.current.y
			}

			cloneElement.current.style.width = sPosition.current.width + dx + 'px'
			cloneElement.current.style.height = sPosition.current.height + dy + 'px'
		}
		const handleMouseUp = (event: React.MouseEvent) => {
			if (!sPosition.current) {
				return
			}

			event.preventDefault()
			event.stopPropagation()

			const a = aspect(sPosition.current.width, sPosition.current.height)
			let dx = 0,
				dy = 0

			if (sPosition.current?.dir === 'e') {
				dx =
					minMax(
						event.clientX,
						sPosition.current.minX,
						sPosition.current.maxX
					) - sPosition.current.x
				if (event.shiftKey && resize.includes('se')) {
					dy = dx * a
				}
			} else if (sPosition.current?.dir === 's') {
				dy =
					minMax(
						event.clientY,
						sPosition.current.minY,
						sPosition.current.maxY
					) - sPosition.current.y
				if (event.shiftKey && resize.includes('se')) {
					dx = dy / a
				}
			} else if (sPosition.current?.dir === 'se') {
				dx =
					minMax(
						event.clientX,
						sPosition.current.minX,
						sPosition.current.maxX
					) - sPosition.current.x
				dy = event.shiftKey
					? dx * a
					: minMax(
							event.clientY,
							sPosition.current.minY,
							sPosition.current.maxY
					  ) - sPosition.current.y
			}

			storeTemplate.setWidth(
				minMax(
					storeTemplate.current.width +
						dx / storeTemplate.mm / storeTemplate.scale,
					0.1
				)
			)

			storeTemplate.setHeight(
				minMax(
					storeTemplate.current.height +
						dy / storeTemplate.mm / storeTemplate.scale,
					0.1
				)
			)

			cloneElement.current?.remove()
			sPosition.current = null
			cloneElement.current = null
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
					(!preview && storeTemplate.selected.includes(String(object.id))
						? ' ' + classes.active
						: '')
				}
				onClick={handleClick}
				data-draggable={!preview}
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

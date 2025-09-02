import { Button, Stack } from '@mantine/core'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { minMax } from '../../shared/utils'
import { useAppContext } from '../context'
import classes from './element.module.css'
import { resizeObject } from './utils/resize'

function aspect(width: number, height: number): number {
	return width / height
}

export const Element = observer(
	({
		object,
		preview,
		scale = 1,
	}: {
		object: object
		preview: boolean
		scale: number
	}) => {
		const refParent = useRef<HTMLDivElement>(null)
		const ctx = useAppContext()
		const style = useMemo(
			() => ({
				...object.style?.(scale, refParent.current),
				...(preview ? { outline: '0px' } : {}),
			}),
			[object, refParent.current]
		)
		const handleClick = (event: React.MouseEvent) => {
			if (preview) {
				return
			}
			const element = (event.target as HTMLElement).closest(
				`.${classes.element}`
			)
			if (element instanceof HTMLDivElement) {
				event.preventDefault()
				event.stopPropagation()
			}

			if (event.ctrlKey) {
				storeTemplate.selectObject(element?.id as string)
			} else {
				if (element instanceof HTMLDivElement) {
					storeTemplate.setActiveObject(element.id)
				}
			}

			ctx?.setFontFamilyFlag?.(false)
			ctx?.setVariableFlag?.(false)
			ctx?.setImageFlag?.(false)
		}

		const resize = preview ? [] : (object?.resize as Array<'s' | 'e' | 'se'>)
		const sPosition = useRef(null)
		const cloneElement = useRef(null)

		const handleMouseDown = (
			event: React.MouseEvent,
			dir: 's' | 'e' | 'se'
		) => {
			if (preview) {
				return
			}
			const element = (event.target as HTMLElement).closest(
				`.${classes.element}`
			)
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
		const handleMouseMove = (event: MouseEvent) => {
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

			if (object.rotation === 90 || object.rotation === 270) {
				cloneElement.current.style.height = sPosition.current.width + dx + 'px'
				cloneElement.current.style.width = sPosition.current.height + dy + 'px'
				cloneElement.current.style.translate = `${-(dy - dx) / 2}px ${
					(dy - dx) / 2
				}px`
			} else {
				cloneElement.current.style.width = sPosition.current.width + dx + 'px'
				cloneElement.current.style.height = sPosition.current.height + dy + 'px'
			}
		}
		const handleMouseUp = (event: MouseEvent) => {
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

			const ddx = dx / storeTemplate.mm / scale
			const ddy = dy / storeTemplate.mm / scale

			if (object.rotation === 90 || object.rotation === 270) {
				resizeObject(ddy, ddx)
				object.rotation === 270 && storeTemplate.moveY(ddy)
			} else {
				resizeObject(ddx, ddy)
				object.rotation === 180 && storeTemplate.moveY(ddy)
				object.rotation === 180 && storeTemplate.moveX(ddx)
			}

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
		}, [object])

		return (
			<div
				id={object.id}
				style={style}
				ref={refParent}
				className={clsx(classes.element, {
					[classes.active]:
						!preview && storeTemplate.selected.includes(String(object.id)),
					[classes[`rotation-${object.rotation}`]]: object.rotation,
				})}
				onClick={handleClick}
				data-draggable={!preview}
			>
				{object.type === 'barcode' &&
					['datamatrix', 'qrcode'].includes(object.code_type) && (
						<Stack
							className={classes.size}
							pos='absolute'
							right='100%'
							top='0'
							gap={1}
						>
							<Button
								size='compact-xs'
								variant='filled'
								onClick={() => storeTemplate.setWidth(object.width + 1)}
							>
								+
							</Button>
							<Button
								size='compact-xs'
								variant='filled'
								onClick={() => storeTemplate.setWidth(object.width - 1)}
							>
								-
							</Button>
						</Stack>
					)}

				{object.render(scale, preview)}
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

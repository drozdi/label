import { Button, Stack } from '@mantine/core'
import clsx from 'clsx'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeTemplate } from '../../entites/template/store'
import { useGuideLine } from '../../services/guide-line/context'
import { useTemplate } from '../../services/template/hooks/use-template'
import { SNAP_THRESHOLD } from '../../shared/constants'
import { minMax, round, roundInt } from '../../shared/utils'
import classes from './element.module.css'

function aspect(width: number, height: number): number {
	return width / height
}

export const Element = observer(
	({ object, preview, scale = 1 }: { object: Record<string, any>; preview?: boolean; scale: number }) => {
		if (preview && !object.enabled) {
			return ''
		}
		const template = useTemplate()
		const refWrap = useRef<HTMLDivElement>(null)
		const rectParent = useRef<DOMRect>({} as DOMRect)
		const rectElement = useRef<DOMRect>({} as DOMRect)
		const refLine = useRef<{
			x: number[]
			y: number[]
		}>({ x: [], y: [] })

		const style = useMemo(
			() => ({
				...object.style?.(scale),
				...(preview ? { outline: '0px' } : {}),
			}),
			[object, scale, preview, refWrap.current]
		)

		const handleClick = useCallback(
			(event: React.MouseEvent) => {
				if (preview) {
					return
				}
				const element = (event.target as HTMLElement).closest(`.${classes.element}`)

				if (element instanceof HTMLDivElement) {
					event.preventDefault()
					event.stopPropagation()
				}

				if (event.ctrlKey) {
					storeTemplate.selectObject(element?.id as string)
				} else if (element instanceof HTMLDivElement) {
					storeTemplate.setActiveObject(element.id)
				}

				storeApp?.setFontFamilyFlag?.(false)
				storeApp?.setVariableFlag?.(false)
				storeApp?.setImageFlag?.(false)
			},
			[preview]
		)

		const { snap, showLine, hideLine } = useGuideLine()

		const resize = preview ? [] : (object?.resize as Array<'s' | 'e' | 'se'>)
		const sPosition = useRef<{
			minX: number
			maxX: number
			minY: number
			maxY: number
			width: number
			height: number
			top: number
			left: number
			x: number
			y: number
			dir: 's' | 'e' | 'se'
		}>(null)
		const cloneElement = useRef<HTMLElement>(null)

		const handleMouseDown = useCallback(
			(event: React.MouseEvent, dir: 's' | 'e' | 'se') => {
				if (preview) {
					return
				}
				const element = (event.target as HTMLElement).closest(`.${classes.element}`) as HTMLElement

				if (element instanceof HTMLDivElement) {
					event.preventDefault()
					event.stopPropagation()
					storeTemplate.setActiveObject(element.id)
				}

				refLine.current = {
					x: storeTemplate.divisionsX,
					y: storeTemplate.divisionsY,
				}

				rectElement.current = element.getBoundingClientRect()
				rectParent.current = (element.parentNode as HTMLElement)?.getBoundingClientRect()

				cloneElement.current = element.cloneNode(true) as HTMLElement
				cloneElement.current?.classList?.add?.(classes.clone)
				;(element.parentNode as HTMLElement).appendChild(cloneElement.current)

				storeTemplate.inverseIds.forEach(id => {
					const { rotation } = storeTemplate.findById(id)
					const guide = document.getElementById(id)
					const guideRect = guide.getBoundingClientRect()

					const guideLeft = guideRect.left - rectParent.current.left
					const guideTop = guideRect.top - rectParent.current.top

					refLine.current.x.push(guideLeft)
					refLine.current.x.push(
						guideLeft + (rotation === 90 || rotation === 270 ? guide.offsetHeight : guide.offsetWidth) / 2
					)
					refLine.current.x.push(
						guideLeft + (rotation === 90 || rotation === 270 ? guide.offsetHeight : guide.offsetWidth)
					)

					refLine.current.y.push(guideTop)
					refLine.current.y.push(
						guideTop + (rotation === 90 || rotation === 270 ? guide.offsetWidth : guide.offsetHeight) / 2
					)
					refLine.current.y.push(
						guideTop + (rotation === 90 || rotation === 270 ? guide.offsetWidth : guide.offsetHeight)
					)
				})

				refLine.current.x.sort((a, b) => a - b)
				refLine.current.y.sort((a, b) => a - b)

				sPosition.current = {
					minX: rectElement.current.left + 2,
					maxX: rectParent.current.right - 2,
					minY: rectElement.current.top + 2,
					maxY: rectParent.current.bottom - 2,
					width: rectElement.current.width,
					height: rectElement.current.height,
					x: event.clientX,
					y: event.clientY,
					top: rectElement.current.top - rectParent.current.top,
					left: rectElement.current.left - rectParent.current.left,
					dir,
				}
			},
			[preview]
		)

		const calcOffset = useCallback((event: MouseEvent) => {
			const a = aspect(sPosition.current.width, sPosition.current.height)
			let dx = 0
			let dy = 0

			snap.current.isX = false
			snap.current.isY = false

			event.preventDefault()
			event.stopPropagation()

			if (sPosition.current?.dir === 'e') {
				dx = minMax(event.clientX, sPosition.current.minX, sPosition.current.maxX) - sPosition.current.x
				if (event.shiftKey && resize.includes('se')) {
					dy = dx * a
				}
			} else if (sPosition.current?.dir === 's') {
				dy = minMax(event.clientY, sPosition.current.minY, sPosition.current.maxY) - sPosition.current.y
				if (event.shiftKey && resize.includes('se')) {
					dx = dy / a
				}
			} else if (sPosition.current?.dir === 'se') {
				dx = minMax(event.clientX, sPosition.current.minX, sPosition.current.maxX) - sPosition.current.x
				dy = event.shiftKey
					? dx * a
					: minMax(event.clientY, sPosition.current.minY, sPosition.current.maxY) - sPosition.current.y
			}

			let newX = event.clientX - rectParent.current.left
			let newY = event.clientY - rectParent.current.top

			for (let x of refLine.current.x) {
				if (Math.abs(newX - x) < SNAP_THRESHOLD) {
					dx = x - (sPosition.current.width + sPosition.current.left)
					snap.current.x = x
					snap.current.isX = true
					if (event.shiftKey) {
						dy = dx * a
					}
					break
				}
			}

			for (let y of refLine.current.y) {
				if (Math.abs(newY - y) < SNAP_THRESHOLD) {
					dy = y - (sPosition.current.height + sPosition.current.top)
					snap.current.y = y
					snap.current.isY = true
					if (event.shiftKey) {
						dy = dx * a
					}
					break
				}
			}

			return [roundInt(dx), roundInt(dy)]
		}, [])

		const handleMouseMove = (event: MouseEvent) => {
			if (!sPosition.current) {
				return
			}

			const [dx, dy] = calcOffset(event)

			if (object.rotation === 90 || object.rotation === 270) {
				;(cloneElement.current as HTMLElement).style.height = sPosition.current.width + dx + 'px'
				;(cloneElement.current as HTMLElement).style.width = sPosition.current.height + dy + 'px'
			} else {
				;(cloneElement.current as HTMLElement).style.width = sPosition.current.width + dx + 'px'
				;(cloneElement.current as HTMLElement).style.height = sPosition.current.height + dy + 'px'
			}

			if (object.rotation === 90) {
				;(cloneElement.current as HTMLElement).style.translate = `${dx}px 0px`
			} else if (object.rotation === 180) {
				;(cloneElement.current as HTMLElement).style.translate = `${dx}px ${dy}px`
			} else if (object.rotation === 270) {
				;(cloneElement.current as HTMLElement).style.translate = `0px ${dy}px`
			}

			showLine()
		}
		const handleMouseUp = (event: MouseEvent) => {
			if (!sPosition.current) {
				return
			}

			const [dx, dy] = calcOffset(event).map(val => round(val / storeTemplate.mm / scale))

			if (object.rotation === 90 || object.rotation === 270) {
				template.resizeObject(dy, dx)
				object.rotation === 270 && storeTemplate.moveY(dy)
			} else {
				template.resizeObject(dx, dy)
				object.rotation === 180 && storeTemplate.moveY(dy)
				object.rotation === 180 && storeTemplate.moveX(dx)
			}

			hideLine()
			cloneElement.current?.remove()
			sPosition.current = null
			delete cloneElement.current
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
				ref={refWrap}
				className={clsx(classes.element, {
					[classes.active]: !preview && storeTemplate.selected.includes(String(object.id)),
					[classes[`rotation-${object.rotation}`]]: object.rotation,
				})}
				onClick={handleClick}
			>
				{object.type === 'barcode' && ['datamatrix', 'qrcode'].includes(object.code_type) && (
					<Stack className={classes.size} pos='absolute' right='100%' top='0' gap={1}>
						<Button size='compact-xs' variant='filled' onClick={() => storeTemplate.setWidth(object.width + 1)}>
							+
						</Button>
						<Button size='compact-xs' variant='filled' onClick={() => storeTemplate.setWidth(object.width - 1)}>
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

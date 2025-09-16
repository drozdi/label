import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { useGuideLine } from '../../services/guide-line/context'
import { serviceTemplate } from '../../services/template/service'
import { SNAP_THRESHOLD, STEP } from '../../shared/constants'
import { minMax, round } from '../../shared/utils'
import { Element } from '../element/element'
import classes from '../element/element.module.css'
import { BackgroundBg } from './background-bg'
import { BackgroundGrid } from './background-grid'
import claseesBG from './background.module.css'
import { deleteObject } from './utils/delete'
import { move, moveX, moveY } from './utils/move'

export const Template = observer(() => {
	const {
		objects,
		current,
	}: {
		objects: Record<string, any>[]
		current: Record<string, any>
	} = storeTemplate
	const refTemplate = useRef<HTMLDivElement>(null)
	const isDrag = useRef<boolean>(false)
	const isSelecting = useRef<boolean>(false)
	const [rectSelected, setRectSelected] = useState<Record<string, any>>({
		display: 'block',
		position: 'absolute',
		left: -1,
		top: -1,
		right: '',
		bottom: '',
		width: '',
		height: '',
		zIndex: 1000,
		border: '1px dashed #0011ff48',
	})
	const sPosition = useRef<{
		minX?: number
		maxX?: number
		minY?: number
		maxY?: number
		p?: number[]
		s?: number[]
		x: number
		y: number
	}>({
		x: 0,
		y: 0,
	})
	const rectParent = useRef<DOMRect>({} as DOMRect)
	const cloneElement = useRef<
		{
			minX: number
			maxX: number
			minY: number
			maxY: number
			top: number
			left: number
			width: number
			height: number
			rotation: number
			clone: HTMLElement
			element: HTMLElement
			offsetX: number
			offsetY: number
		}[]
	>([])
	const guideElements = useRef<HTMLElement[]>([])

	const { verticalLine, horizontalLine, snap, hideLine, showLine } = useGuideLine()

	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		const element = (event.target as HTMLElement).closest(`.${classes.element}`)
		if (!isDrag.current && element instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(element.id ?? 0)
		}
	}, [])

	const handleDragMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
		rectParent.current = (refTemplate.current as HTMLElement)?.getBoundingClientRect()

		guideElements.current = storeTemplate.inverseIds.map(id => document.getElementById(id) as HTMLElement)

		storeTemplate.selectedObjects.forEach(({ id, rotation }) => {
			const element = document.getElementById(id) as HTMLElement
			const rect = element.getBoundingClientRect()
			const clone = element.cloneNode(true) as HTMLElement

			clone?.classList?.add?.(classes.clone)

			let canvas: HTMLCanvasElement | null | undefined = null
			if ((canvas = element?.querySelector('canvas'))) {
				clone.querySelector('canvas').getContext('2d').drawImage(canvas, 0, 0)
			}

			refTemplate.current?.appendChild(clone)

			cloneElement.current.push({
				minX: rectParent.current.left - (rect.left - event.clientX),
				maxX: rectParent.current.right - (rect.right - event.clientX),
				minY: rectParent.current.top - (rect.top - event.clientY),
				maxY: rectParent.current.bottom - (rect.bottom - event.clientY),
				top: rect.top - rectParent.current.top,
				left: rect.left - rectParent.current.left,
				_top:
					rect.top -
					rectParent.current.top +
					(rotation === 90 || rotation === 270 ? (rect?.height - rect?.width) / 2 : 0),
				_left:
					rect.left -
					rectParent.current.left -
					(rotation === 90 || rotation === 270 ? (rect?.height - rect?.width) / 2 : 0),
				width: rect.width,
				height: rect.height,
				rotation,
				element,
				clone,
				offsetX: event.clientX - rect.left,
				offsetY: event.clientY - rect.top,
			})
			element.style.opacity = 0.1
		})

		sPosition.current = {
			minX: cloneElement.current.reduce((acc, item) => Math.max(acc, item.minX), 0) + 1,
			maxX: cloneElement.current.reduce((acc, item) => Math.min(acc, item.maxX), 100000) - 2,
			minY: cloneElement.current.reduce((acc, item) => Math.max(acc, item.minY), 0) + 1,
			maxY: cloneElement.current.reduce((acc, item) => Math.min(acc, item.maxY), 100000) - 2,
			x: event?.clientX,
			y: event?.clientY,
		}
		isDrag.current = storeTemplate.selected.length > 0
	}, [])

	const calckOffset = useCallback((event: MouseEvent) => {
		let dx = minMax(event.clientX, sPosition.current?.minX, sPosition.current?.maxX) - sPosition.current?.x

		let dy = minMax(event.clientY, sPosition.current?.minY, sPosition.current?.maxY) - sPosition.current?.y

		snap.current.isX = false
		snap.current.isY = false

		guideElements.current.forEach(guide => {
			const { rotation } = storeTemplate.findById(guide.id)
			const guideRect = guide.getBoundingClientRect()

			const guideLeft = guideRect.left - rectParent.current.left
			const guideCenterX =
				guideLeft + (rotation === 90 || rotation === 270 ? guide.offsetHeight : guide.offsetWidth) / 2
			const guideRight = guideLeft + (rotation === 90 || rotation === 270 ? guide.offsetHeight : guide.offsetWidth)

			const guideTop = guideRect.top - rectParent.current.top
			const guideCenterY = guideTop + (rotation === 90 || rotation === 270 ? guide.offsetWidth : guide.offsetHeight) / 2
			const guideBottom = guideTop + (rotation === 90 || rotation === 270 ? guide.offsetWidth : guide.offsetHeight)

			cloneElement.current.forEach(clone => {
				let newX = event.clientX - rectParent.current.left - clone.offsetX
				let newY = event.clientY - rectParent.current.top - clone.offsetY

				if (Math.abs(newX - guideLeft) < SNAP_THRESHOLD) {
					dx = guideLeft - clone.left
					snap.current.x = guideLeft
					snap.current.isX = true
				} else if (Math.abs(newX - guideCenterX) < SNAP_THRESHOLD) {
					dx = guideCenterX - clone.left
					snap.current.x = guideCenterX
					snap.current.isX = true
				} else if (Math.abs(newX - guideRight) < SNAP_THRESHOLD) {
					dx = guideRight - clone.left
					snap.current.x = guideRight
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width / 2 - guideLeft) < SNAP_THRESHOLD) {
					dx = guideLeft - clone.width / 2 - clone.left
					snap.current.x = guideLeft
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width / 2 - guideCenterX) < SNAP_THRESHOLD) {
					dx = guideCenterX - clone.width / 2 - clone.left
					snap.current.x = guideCenterX
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width / 2 - guideRight) < SNAP_THRESHOLD) {
					dx = guideRight - clone.width / 2 - clone.left
					snap.current.x = guideRight
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width - guideLeft) < SNAP_THRESHOLD) {
					dx = guideLeft - clone.width - clone.left
					snap.current.x = guideLeft
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width - guideCenterX) < SNAP_THRESHOLD) {
					dx = guideCenterX - clone.width - clone.left
					snap.current.x = guideCenterX
					snap.current.isX = true
				} else if (Math.abs(newX + clone.width - guideRight) < SNAP_THRESHOLD) {
					dx = guideRight - clone.width - clone.left
					snap.current.x = guideRight
					snap.current.isX = true
				}

				if (Math.abs(newY - guideTop) < SNAP_THRESHOLD) {
					dy = guideTop - clone.top
					snap.current.y = guideTop
					snap.current.isY = true
				} else if (Math.abs(newY - guideCenterY) < SNAP_THRESHOLD) {
					dy = guideCenterY - clone.top
					snap.current.y = guideCenterY
					snap.current.isY = true
				} else if (Math.abs(newY - guideBottom) < SNAP_THRESHOLD) {
					dy = guideBottom - clone.top
					snap.current.y = guideBottom
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height / 2 - guideTop) < SNAP_THRESHOLD) {
					dy = guideTop - clone.height / 2 - clone.top
					snap.current.y = guideTop
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height / 2 - guideCenterY) < SNAP_THRESHOLD) {
					dy = guideCenterY - clone.height / 2 - clone.top
					snap.current.y = guideCenterY
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height / 2 - guideBottom) < SNAP_THRESHOLD) {
					dy = guideBottom - clone.height / 2 - clone.top
					snap.current.y = guideBottom
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height - guideTop) < SNAP_THRESHOLD) {
					dy = guideTop - clone.height - clone.top
					snap.current.y = guideTop
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height - guideCenterY) < SNAP_THRESHOLD) {
					dy = guideCenterY - clone.height - clone.top
					snap.current.y = guideCenterY
					snap.current.isY = true
				} else if (Math.abs(newY + clone.height - guideBottom) < SNAP_THRESHOLD) {
					dy = guideBottom - clone.height - clone.top
					snap.current.y = guideBottom
					snap.current.isY = true
				}
			})
		})

		showLine()
		return [dx, dy]
	}, [])

	const handleDragMouseMove = useCallback((event: MouseEvent) => {
		if (!isDrag.current) {
			return
		}

		event.preventDefault()
		event.stopPropagation()

		const [dx, dy] = calckOffset(event)

		cloneElement.current.forEach(item => {
			item.clone.style.left = item._left + dx + 'px'
			item.clone.style.top = item._top + dy + 'px'
		})
	}, [])
	const handleDragMouseUp = useCallback((event: MouseEvent) => {
		if (!isDrag.current) {
			return
		}

		event.preventDefault()
		event.stopPropagation()

		const [dx, dy] = calckOffset(event).map(v => v / storeTemplate.mm / storeTemplate.scale)

		move(round(dx), round(dy))

		cloneElement.current.forEach(item => {
			item.clone?.remove()
			item.element.style.opacity = 1
		})

		hideLine()

		sPosition.current = {
			x: 0,
			y: 0,
		}
		cloneElement.current = []
		isDrag.current = false
	}, [])

	const clearRect = useCallback(() => {
		setRectSelected(v => ({
			...v,
			left: -1,
			top: -1,
			width: '',
			height: '',
			right: '',
			bottom: '',
		}))
	}, [])

	const isIntersecting = useCallback((element: HTMLElement, rect: Record<string, any>) => {
		const elementRect = element.getBoundingClientRect()

		const elemX = elementRect.left - rectParent.current.left
		const elemY = elementRect.top - rectParent.current.top

		return !(
			rect.right < elemX ||
			rect.left > elemX + elementRect.width ||
			rect.bottom < elemY ||
			rect.top > elemY + elementRect.height
		)
	}, [])
	const handleSelectMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
		rectParent.current = (refTemplate.current as HTMLElement)?.getBoundingClientRect()
		setRectSelected(v => ({
			...v,
			left: event.clientX - rectParent.current.left,
			top: event.clientY - rectParent.current.top,
			width: '',
			height: '',
		}))
		sPosition.current = {
			x: event?.clientX,
			y: event?.clientY,
			p: [event.clientX - rectParent.current.left, event.clientY - rectParent.current.top],
		}
		isSelecting.current = true
	}, [])
	const handleSelectMouseMove = useCallback((event: MouseEvent) => {
		if (!isSelecting.current) {
			return
		}
		const items = (refTemplate.current as HTMLElement).querySelectorAll(`.${classes.element}`)
		const x = minMax(event.clientX, rectParent.current.left, rectParent.current.right - 2)
		const y = minMax(event.clientY, rectParent.current.top, rectParent.current.bottom - 2)

		sPosition.current = {
			...sPosition.current,
			s: [x - sPosition.current.x, y - sPosition.current.y],
		}

		const rect = {
			left: sPosition.current.s[0] > 0 ? sPosition.current.p[0] : sPosition.current.p[0] + sPosition.current.s[0],
			top: sPosition.current.s[1] > 0 ? sPosition.current.p[1] : sPosition.current.p[1] + sPosition.current.s[1],
			width: Math.abs(sPosition.current.s[0]),
			height: Math.abs(sPosition.current.s[1]),
		}
		rect.right = rect.left + rect.width
		rect.bottom = rect.top + rect.height

		items.forEach(item => {
			if (isIntersecting(item as HTMLElement, rect)) {
				storeTemplate.selectedById(item.id, true)
			} else {
				storeTemplate.selectedById(item.id, false)
			}
		})
		setRectSelected(v => ({
			...v,
			...rect,
		}))
	}, [])
	const handleSelectMouseUp = useCallback((event: MouseEvent) => {
		if (!isSelecting.current) {
			return
		}
		sPosition.current = { x: 0, y: 0 }
		isSelecting.current = false
		clearRect()
	}, [])

	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLElement>) => {
		const element = (event.target as HTMLElement)?.closest(`.${classes.element}`)
		if ((!element || (storeTemplate.isOne() && String(current?.id) !== String(element?.id))) && !event.ctrlKey) {
			storeTemplate.setActiveObject(element?.id || 0)
		}
		if (storeTemplate.isEmpty() && element instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(element?.id || 0)
		}

		if (element?.id) {
			handleDragMouseDown(event)
		} else {
			handleSelectMouseDown(event)
		}
	}, [])
	const handleMouseMove = useCallback((event: MouseEvent) => {
		if (isDrag.current) {
			handleDragMouseMove(event)
		} else if (isSelecting.current) {
			handleSelectMouseMove(event)
		}
	}, [])
	const handleMouseUp = useCallback((event: MouseEvent) => {
		if (isDrag.current) {
			handleDragMouseUp(event)
		} else if (isSelecting.current) {
			handleSelectMouseUp(event)
		}
	}, [])

	useEffect(() => {
		if (!current) {
			storeApp.setFontFamilyFlag(false)
			storeApp.setVariableFlag(false)
			storeApp.setImageFlag(false)
			storeApp.setLoadTemplateFlag(false)
			storeApp.setDataMatrixFlag(false)
		}
	}, [current])

	useEffect(() => {
		const pressKey = async (event: KeyboardEvent) => {
			if (event.code === 'F5') {
				return
			}
			if (event.code === 'Escape') {
				storeTemplate.setActiveObject(0)
			}
			if (!storeTemplate.current && !storeTemplate.isOne) {
				return
			}
			if (
				['input', 'textarea'].includes((event.target as HTMLElement)?.localName as string) ||
				!['Delete', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'KeyZ', 'KeyY', 'KeyS', 'KeyC', 'KeyV'].includes(
					event.code
				)
			) {
				return
			}
			event.stopPropagation()
			event.preventDefault()

			if (event.code === 'Delete') {
				deleteObject()
			}
			if (event.code === 'ArrowRight') {
				moveX(STEP)
			}
			if (event.code === 'ArrowLeft') {
				moveX(-STEP)
			}
			if (event.code === 'ArrowUp') {
				moveY(-STEP)
			}
			if (event.code === 'ArrowDown') {
				moveY(STEP)
			}

			if (event.ctrlKey) {
				if (event.code === 'KeyZ') {
					storeHistory.back()
				}
				if (event.code === 'KeyY') {
					storeHistory.forward()
				}
				if (event.code === 'KeyS') {
					await serviceTemplate.handleSave()
				}
				if (event.code === 'KeyC') {
					serviceTemplate.copy()
				}
				if (event.code === 'KeyV') {
					serviceTemplate.paste()
				}
			} //*/
		}
		document.addEventListener('keydown', pressKey)
		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.removeEventListener('keydown', pressKey)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	return (
		<div
			style={{
				position: 'relative',
				height: storeTemplate.height,
				width: storeTemplate.width,
				borderRadius: storeTemplate.borderRadius,
				userSelect: 'none',
				overflow: 'hidden',
				background: '#fff',
			}}
		>
			<div
				style={{
					position: 'absolute',
					fontSize: 12,
					color: '#000000a1',
					left: storeTemplate.referenceX - 20,
					top: storeTemplate.referenceY + 8,
					textWrap: 'nowrap',
					writingMode: 'vertical-lr',
				}}
			>
				reference по - x
			</div>
			<div
				style={{
					position: 'absolute',
					fontSize: 12,
					color: '#000000a1',
					left: storeTemplate.referenceX + 8,
					top: storeTemplate.referenceY - 20,
					textWrap: 'nowrap',
				}}
			>
				reference по - y
			</div>
			<BackgroundGrid />
			<div
				style={{
					overflow: 'hidden',
					position: 'relative',
					border: '1px solid #c3bfbf',
					height: storeTemplate.height,
					width: storeTemplate.width,
					borderRadius: storeTemplate.borderRadius,
					marginLeft: storeTemplate.referenceX,
					marginTop: storeTemplate.referenceY,
					color: '#000000',
				}}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				ref={refTemplate}
			>
				<BackgroundBg />
				<div style={rectSelected}></div>
				<div ref={verticalLine} className={`${claseesBG.line} ${claseesBG.lineV}`}></div>
				<div ref={horizontalLine} className={`${claseesBG.line} ${claseesBG.lineH}`}></div>

				{objects.map((object: Record<string, any>) => (
					<Element key={object.id} scale={storeTemplate.scale} object={object} />
				))}
			</div>
		</div>
	)
})

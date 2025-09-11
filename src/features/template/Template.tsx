import { observer } from 'mobx-react-lite'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeHistory } from '../../entites/history/store'
import { storeTemplate } from '../../entites/template/store'
import { serviceTemplate } from '../../services/template/service'
import { STEP } from '../../shared/constants'
import { minMax, round } from '../../shared/utils'
import { Element } from '../element/element'
import classes from '../element/element.module.css'
import { BackgroundBg } from './background-bg'
import { BackgroundGrid } from './background-grid'
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
		border: '1px dashed #00000077',
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
			rotation: number
			clone: HTMLElement
			offsetX: number
			offsetY: number
		}[]
	>([])

	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		const element = (event.target as HTMLElement).closest(`.${classes.element}`)
		if (!isDrag.current && element instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(element.id ?? 0)
		}
	}, [])

	const handleDragMouseDown = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			rectParent.current = (
				refTemplate.current as HTMLElement
			)?.getBoundingClientRect()

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
					top:
						rect.top -
						rectParent.current.top +
						(rotation === 90 || rotation === 270
							? (rect?.height - rect?.width) / 2
							: 0),
					left:
						rect.left -
						rectParent.current.left -
						(rotation === 90 || rotation === 270
							? (rect?.height - rect?.width) / 2
							: 0),
					rotation,
					clone,
					offsetX: event.clientX - rect.left,
					offsetY: event.clientY - rect.top,
				})
			})
			sPosition.current = {
				minX:
					cloneElement.current.reduce(
						(acc, item) => Math.max(acc, item.minX),
						0
					) + 1,
				maxX:
					cloneElement.current.reduce(
						(acc, item) => Math.min(acc, item.maxX),
						100000
					) - 2,
				minY:
					cloneElement.current.reduce(
						(acc, item) => Math.max(acc, item.minY),
						0
					) + 1,
				maxY:
					cloneElement.current.reduce(
						(acc, item) => Math.min(acc, item.maxY),
						100000
					) - 2,
				x: event?.clientX,
				y: event?.clientY,
			}
			isDrag.current = storeTemplate.selected.length > 0
		},
		[]
	)
	const handleDragMouseMove = useCallback((event: MouseEvent) => {
		if (!isDrag.current) {
			return
		}

		event.preventDefault()
		event.stopPropagation()

		const dx =
			minMax(
				event.clientX,
				sPosition.current?.minX ?? 0,
				sPosition.current?.maxX ?? window.innerWidth
			) - (sPosition.current?.x ?? 0)

		const dy =
			minMax(
				event.clientY,
				sPosition.current?.minY ?? 0,
				sPosition.current?.maxY ?? window.innerHeight
			) - (sPosition.current?.y ?? 0)

		cloneElement.current.forEach(item => {
			item.clone.style.left = item.left + dx + 'px'
			item.clone.style.top = item.top + dy + 'px'
		})
	}, [])
	const handleDragMouseUp = useCallback((event: MouseEvent) => {
		if (!isDrag.current) {
			return
		}

		event.preventDefault()
		event.stopPropagation()

		const dx =
			minMax(event.clientX, sPosition.current.minX, sPosition.current.maxX) -
			sPosition.current.x

		const dy =
			minMax(event.clientY, sPosition.current.minY, sPosition.current.maxY) -
			sPosition.current.y

		move(
			round(dx / storeTemplate.mm / storeTemplate.scale),
			round(dy / storeTemplate.mm / storeTemplate.scale)
		)

		cloneElement.current.forEach(item => item.clone?.remove())

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

	const isIntersecting = useCallback(
		(element: HTMLElement, rect: Record<string, any>) => {
			const elementRect = element.getBoundingClientRect()

			// Приводим координаты к относительным относительно контейнера
			const elemX = elementRect.left - rectParent.current.left
			const elemY = elementRect.top - rectParent.current.top

			return !(
				rect.right < elemX ||
				rect.left > elemX + elementRect.width ||
				rect.bottom < elemY ||
				rect.top > elemY + elementRect.height
			)
		},
		[]
	)
	const handleSelectMouseDown = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			rectParent.current = (
				refTemplate.current as HTMLElement
			)?.getBoundingClientRect()
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
				p: [
					event.clientX - rectParent.current.left,
					event.clientY - rectParent.current.top,
				],
			}
			isSelecting.current = true
		},
		[]
	)
	const handleSelectMouseMove = useCallback((event: MouseEvent) => {
		if (!isSelecting.current) {
			return
		}
		const items = (refTemplate.current as HTMLElement).querySelectorAll(
			`.${classes.element}`
		)
		// if (!items.length) {
		// 	return
		// }
		const x = minMax(
			event.clientX,
			rectParent.current.left,
			rectParent.current.right - 2
		)
		const y = minMax(
			event.clientY,
			rectParent.current.top,
			rectParent.current.bottom - 2
		)

		sPosition.current = {
			...sPosition.current,
			s: [x - sPosition.current.x, y - sPosition.current.y],
		}

		const rect = {
			left:
				sPosition.current.s[0] > 0
					? sPosition.current.p[0]
					: sPosition.current.p[0] + sPosition.current.s[0],
			top:
				sPosition.current.s[1] > 0
					? sPosition.current.p[1]
					: sPosition.current.p[1] + sPosition.current.s[1],
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

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const element = (event.target as HTMLElement)?.closest(
				`.${classes.element}`
			)
			if (
				(!element ||
					(storeTemplate.isOne() &&
						String(current?.id) !== String(element?.id))) &&
				!event.ctrlKey
			) {
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
		},
		[]
	)
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
				['input', 'textarea'].includes(
					(event.target as HTMLElement)?.localName as string
				) ||
				![
					'Delete',
					'ArrowRight',
					'ArrowLeft',
					'ArrowUp',
					'ArrowDown',
					'KeyZ',
					'KeyY',
					'KeyS',
					'KeyC',
					'KeyV',
				].includes(event.code)
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
				{objects.map((object: Record<string, any>) => (
					<Element
						key={object.id}
						scale={storeTemplate.scale}
						object={object}
					/>
				))}
			</div>
		</div>
	)
})

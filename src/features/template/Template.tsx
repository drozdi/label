import { observer } from 'mobx-react-lite'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { STEP } from '../../shared/constants'
import { minMax } from '../../shared/utils'

import { Element } from './element'
import classes from './Element.module.css'

export const Template = observer(() => {
	const { objects, current } = storeTemplate
	const refTemplate = useRef<HTMLDivElement>(null)
	const isDrag = useRef(false)

	const handleClick = (event: React.MouseEvent) => {
		if (!isDrag.current && event.target instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(0)
		}
	}

	const sPosition = useRef(null)
	const cloneElement = useRef([])

	const handleMouseDown = (event: React.MouseEvent) => {
		const element = event.target.closest(`.${classes.element}`)
		if (!element || (storeTemplate.isOne() && current?.id !== element?.id)) {
			return
		}
		if (storeTemplate.isEmpty() && element instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(element?.id || 0)
		}

		event.preventDefault()
		event.stopPropagation()

		const pRect = refTemplate.current?.getBoundingClientRect()

		storeTemplate.selected.forEach(id => {
			const element = document.getElementById(id)
			const rect = element?.getBoundingClientRect()
			const clone = element?.cloneNode(true)

			clone?.classList?.add?.(classes.clone)

			refTemplate.current?.appendChild(clone)

			cloneElement.current.push({
				minX: pRect.left - (rect.left - event.clientX),
				maxX: pRect.right - (rect.right - event.clientX),
				minY: pRect.top - (rect.top - event.clientY),
				maxY: pRect.bottom - (rect.bottom - event.clientY),
				top: rect.top - pRect.top,
				left: rect.left - pRect.left,
				clone,
			})
		})

		sPosition.current = {
			minX: cloneElement.current.reduce(
				(acc, item) => Math.max(acc, item.minX),
				0
			),
			maxX:
				cloneElement.current.reduce(
					(acc, item) => Math.min(acc, item.maxX),
					10000
				) - 1,
			minY: cloneElement.current.reduce(
				(acc, item) => Math.max(acc, item.minY),
				0
			),
			maxY:
				cloneElement.current.reduce(
					(acc, item) => Math.min(acc, item.maxY),
					10000
				) - 1,
			x: event.clientX,
			y: event.clientY,
		}
		isDrag.current = true
	}
	const handleMouseMove = (event: React.MouseEvent) => {
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

		cloneElement.current.forEach(item => {
			item.clone.style.left = item.left + dx + 'px'
			item.clone.style.top = item.top + dy + 'px'
		})
	}
	const handleMouseUp = (event: React.MouseEvent) => {
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

		storeTemplate.moveX(dx / storeTemplate.mm / storeTemplate.scale)
		storeTemplate.moveY(dy / storeTemplate.mm / storeTemplate.scale)

		cloneElement.current.forEach(item => item.clone?.remove())

		sPosition.current = null
		cloneElement.current = []
		setTimeout(() => (isDrag.current = false), 10)
	}

	useEffect(() => {
		const pressKey = (event: KeyboardEvent) => {
			if (event.key === 'F5') {
				return
			}
			if (event.key === 'Escape') {
				storeTemplate.setActiveObject(0)
			}

			if (!storeTemplate.current && !storeTemplate.isOne) {
				return
			}
			if (
				['input', 'textarea'].includes(event.target?.localName) ||
				!['Delete', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(
					event.key
				)
			) {
				return
			}
			event.stopPropagation()
			event.preventDefault()

			if (event.key === 'Delete') {
				storeTemplate.deleteSelectedObject()
			}
			if (event.key === 'ArrowRight') {
				storeTemplate.moveX(STEP)
			}
			if (event.key === 'ArrowLeft') {
				storeTemplate.moveX(-STEP)
			}
			if (event.key === 'ArrowUp') {
				storeTemplate.moveY(-STEP)
			}
			if (event.key === 'ArrowDown') {
				storeTemplate.moveY(STEP)
			}
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
				background: '#fff',
				overflow: 'hidden',
				position: 'relative',
				border: '1px solid #c3bfbf',
				height: storeTemplate.height,
				width: storeTemplate.width,
				borderRadius: storeTemplate.borderRadius,
				userSelect: 'none',
			}}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			ref={refTemplate}
		>
			{objects.map((object, index) => (
				<Element key={object.id} index={index} object={object} />
			))}
		</div>
	)
})

import { observer } from 'mobx-react-lite'
import type React from 'react'
import { useEffect, useRef } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { STEP } from '../../shared/constants'
import { Element } from './element'

export const Template = observer(() => {
	const { objects } = storeTemplate
	const refTemplate = useRef<HTMLDivElement>(null)

	const handleClick = (event: React.MouseEvent) => {
		/*if (event.target instanceof HTMLDivElement) {
			storeTemplate.setActiveObject(0)
		}*/
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
				storeTemplate.deleteCurrentObject()
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
		return () => {
			document.removeEventListener('keydown', pressKey)
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
			}}
			onClick={handleClick}
			ref={refTemplate}
		>
			{objects.map((object, index) => (
				<Element key={object.id} index={index} object={object} />
			))}
		</div>
	)
})

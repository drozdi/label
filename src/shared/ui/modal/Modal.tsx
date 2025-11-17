import { Modal as ModalMantine } from '@mantine/core'
import { useCallback, useEffect, useRef } from 'react'

interface ModalProps {
	title: string
	children: React.ReactNode
	[key: string]: any
}
export function Modal({ title, children, ...props }: ModalProps) {
	const modalRef = useRef<HTMLDivElement>(null)
	const draging = useRef(false)
	const diffPosition = useRef({ x: 0, y: 0 })
	const oldPosition = useRef({ x: 0, y: 0 })

	const handleMouseUp = () => {
		draging.current = false
	}

	const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
		draging.current = true
		if (modalRef.current) {
			diffPosition.current.x = e.clientX - (modalRef.current.offsetLeft + oldPosition.current.x)
			diffPosition.current.y = e.clientY - (modalRef.current.offsetTop + oldPosition.current.y)
		}
	}
	const updatePosition = (x: number, y: number) => {
		if (modalRef.current) {
			modalRef.current.style.transform = `translate(${x}px, ${y}px)`
		}
		oldPosition.current.x = x
		oldPosition.current.y = y
	}

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!draging.current || !modalRef.current) {
			return
		}
		const mouseX = e.clientX
		const mouseY = e.clientY

		const modalOffsetX = modalRef.current.offsetLeft
		const modalOffsetY = modalRef.current.offsetTop

		const newX = mouseX - diffPosition.current.x - modalOffsetX
		const newY = mouseY - diffPosition.current.y - modalOffsetY

		updatePosition(newX, newY)
	}, [])

	useEffect(() => {
		window.addEventListener('mouseup', handleMouseUp)
		window.addEventListener('mousemove', handleMouseMove)

		return () => {
			window.removeEventListener('mouseup', handleMouseUp)
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	return (
		<ModalMantine.Root {...props}>
			<ModalMantine.Content ref={modalRef}>
				<ModalMantine.Header
					onMouseDown={handleMouseDown}
					style={{
						cursor: 'move',
					}}
				>
					<ModalMantine.Title>{title}</ModalMantine.Title>
					<ModalMantine.CloseButton />
				</ModalMantine.Header>
				<ModalMantine.Body>{children}</ModalMantine.Body>
			</ModalMantine.Content>
		</ModalMantine.Root>
	)
}

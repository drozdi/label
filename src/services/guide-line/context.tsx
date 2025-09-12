import { createContext, useCallback, useContext, useRef } from "react";

const Context = createContext({})

export function ProvideGuideLine ({ children }: {
	children: React.ReactNode
}) {

	const verticalLine = useRef<HTMLElement>(null)
	const horizontalLine = useRef<HTMLElement>(null)
	const snap = useRef({
		isX: false,
		isY: false,
		x: -1,
		y: -1,
	})
	const showVerticalLine = useCallback((left: number) => {
		if (verticalLine.current) {
			verticalLine.current.style.left = `${left - 1}px`
			verticalLine.current.style.display = 'block'
		}
	}, [])
	const showHorizontalLine = useCallback((top: number) => {
		if (horizontalLine.current) {
			horizontalLine.current.style.top = `${top - 1}px`
			horizontalLine.current.style.display = 'block'
		}
	}, [])
	const hideVerticalLine = useCallback(() => {
		if (verticalLine.current) {
			verticalLine.current.style.display = ''
			snap.current.x = -1
			snap.current.isX = false
		}
	}, [])
	const hideHorizontalLine = useCallback(() => {
		if (horizontalLine.current) {
			horizontalLine.current.style.display = ''
			snap.current.y = -1
			snap.current.isY = false
		}
	}, [])
	const hideLine = useCallback(() => {
		snap.current.isX = false
		snap.current.isY = false
		hideVerticalLine()
		hideHorizontalLine()
	}, [])
	const showLine = useCallback(() => {
		if (snap.current.isX || snap.current.isY) {
			if (snap.current.isX) {
				showVerticalLine(snap.current.x)
			} else {
				hideVerticalLine()
			}
			if (snap.current.isY) {
				showHorizontalLine(snap.current.y)
			} else {
				hideHorizontalLine()
			}
		} else {
			hideLine()
		}
	}, [])

	return <Context.Provider value={{
		snap,
		verticalLine,
		horizontalLine,
		showVerticalLine,
		showHorizontalLine,
		hideVerticalLine,
		hideHorizontalLine,
		showLine,
		hideLine,
	}}>
		{children}
	</Context.Provider>
}

export function useGuideLine() {
	return useContext(Context)
}
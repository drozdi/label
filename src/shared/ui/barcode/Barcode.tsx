import bwipjs from 'bwip-js'
import JsBarcode from 'jsbarcode'
import { useCallback, useEffect, useRef } from 'react'

export function Barcode({
	style,
	className,
	value,
	options,
	renderer = 'SVG',
}: Record<string, any>): React.JSX.Element {
	bwipjs
	const containerRef = useRef<never>(null)

	const renderBarcode = useCallback(JsBarcode, [value, containerRef.current, options])

	useEffect(() => {
		renderBarcode(containerRef.current, value, options)
	}, [renderBarcode, value, options, renderer])

	switch (renderer) {
		case 'canvas':
			return <canvas ref={containerRef} style={style} className={className} />
		case 'image':
			return <img ref={containerRef} alt='barcode' style={style} className={className} />
		default:
			return <svg ref={containerRef} style={style} className={className} />
	}
}

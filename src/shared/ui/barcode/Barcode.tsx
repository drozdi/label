import bwipjs from 'bwip-js'

export function Barcode({ style, className, id, children, ...options }: Record<string, any>): React.JSX.Element {
	return (
		<canvas
			id={'mycanvas' + id}
			ref={canvas => {
				if (!canvas) {
					return
				}
				bwipjs.toCanvas(canvas, {
					text: children,
					...options,
				})
			}}
			className={className}
			style={style}
		/>
	)
}

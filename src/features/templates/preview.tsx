import { observer } from 'mobx-react-lite'
import { Element } from '../element/element'

export const Preview = observer(({ template, objects }) => {
	return (
		<div
			style={{
				background: '#fff',
				overflow: 'hidden',
				position: 'relative',
				border: '1px solid #c3bfbf',
				height: template?.height,
				width: template?.width,
				borderRadius: template?.borderRadius,
			}}
		>
			{objects.map((object, index) => (
				<Element preview key={object.id} index={index} object={object} />
			))}
		</div>
	)
})

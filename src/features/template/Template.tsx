import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { Element } from './Element'

export const Template = observer(() => {
	const { objects } = storeTemplate
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
		>
			{objects.map((object, index) => (
				<Element key={object.id} object={object} />
			))}
		</div>
	)
})

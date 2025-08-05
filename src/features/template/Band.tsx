import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'

export const Band = observer(({ children }) => {
	storeTemplate
	return (
		<div
			style={{
				width: storeTemplate.width + 8,
				position: 'relative',
				zIndex: 2,
				height: '100%',
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
				background: '#f6e3bd',
				padding: '0 8px',
				margin: '0 auto',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					background: '#fff',
					overflow: 'hidden',
					position: 'relative',
					border: '1px solid #c3bfbf',
					marginTop: (-storeTemplate.height * 4) / 5,
					height: storeTemplate.height,
					width: storeTemplate.width,
					borderRadius: storeTemplate.borderRadius,
					marginBottom: storeTemplate.space,
				}}
			></div>
			{children}
		</div>
	)
})

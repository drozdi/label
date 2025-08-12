import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'

export const Band = observer(({ template, children }) => {
	template = template || storeTemplate
	return (
		<div
			style={{
				width: (template.width || 60) + 8,
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
					marginTop: (-(template.height || 6) * 4) / 5,
					height: template.height || 60,
					width: template.width || 60,
					borderRadius: template.borderRadius || 5,
					marginBottom: template.space,
				}}
			></div>
			{children}
		</div>
	)
})

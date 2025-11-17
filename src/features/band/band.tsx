import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { minMax } from '../../shared/utils'

export const Band = observer(
	({ template, children }: { template?: Record<string, any>; children: React.ReactNode }) => {
		template = template || storeTemplate
		return (
			<div
				style={{
					width: (template.width || 60) + 8,
					position: 'relative',
					zIndex: 2,
					minHeight: '100%',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					background: '#f6e3bd',
					padding: '0 8px 8px',
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
						marginTop: (-minMax(template.height, 0, 60) * 8) / 10,
						height: minMax(template.height, 0, 60),
						width: template.width || 60,
						borderRadius: template.borderRadius || 5,
						marginBottom: template.space,
					}}
				></div>
				{children}
			</div>
		)
	}
)

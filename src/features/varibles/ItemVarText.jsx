import { Item, ItemLabel, ItemSection } from '../../shared/ui'

export const ItemVarText = ({ selectVar, variable }) => {
	return (
		<Item bordered onClick={() => selectVar(variable)}>
			<ItemSection style={{ gap: 8 }}>
				<ItemLabel>{variable.data}</ItemLabel>
				<ItemLabel
					style={{
						fontSize: variable.name.length < 20 ? '13px' : '12px',
					}}
				>
					{variable.name}
				</ItemLabel>
			</ItemSection>
		</Item>
	)
}

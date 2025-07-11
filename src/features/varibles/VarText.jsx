import { BtnClose, Item, ItemLabel, ItemSection, List } from '../../shared/ui'
import Object from '../../store/Object'
import { ListVatText } from './ListVatText'

export const VarText = ({ setVarText }) => {
	const selectVar = e => {
		if (Object.prop_obj.defaultBody) {
			Object.editBody(e.data)
			Object.setDefaultBodyBolean(false)
			setVarText(false)
		} else {
			Object.editBody(Object.prop_obj.body + e.data)
			setVarText(false)
		}
	}

	return (
		<List as='div'>
			<Item as='div'>
				<ItemSection>
					<ItemLabel header>Переменные</ItemLabel>
				</ItemSection>
				<ItemSection side>
					<BtnClose onClick={() => setVarText(false)} />
				</ItemSection>
			</Item>
			<ListVatText selectVar={selectVar} />
		</List>
	)
}

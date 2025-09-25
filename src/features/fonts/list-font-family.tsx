import { observer } from 'mobx-react-lite'
import { storeFonts } from '../../entites/fonts/store'
import { List } from '../../shared/ui'
import { ItemFontFamily } from './item-font-family'

export const ListFontFamily = observer(() => {
	const { list } = storeFonts
	return (
		<List>
			{list.map(font => (
				<ItemFontFamily key={font.id} font={font} />
			))}
		</List>
	)
})

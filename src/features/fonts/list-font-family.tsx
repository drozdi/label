import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeFonts } from '../../entites/fonts/store'
import { ItemFontFamily } from './item-font-family'

export const ListFontFamily = observer(() => {
	const { list } = storeFonts
	return (
		<Stack>
			{list.map(font => (
				<ItemFontFamily key={font.id} font={font} />
			))}
		</Stack>
	)
})

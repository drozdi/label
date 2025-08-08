import { SimpleGrid } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeImages } from '../../entites/images/store'
import { ItemImage } from './item-image'

export const ListImage = observer(() => {
	const { list } = storeImages
	return (
		<SimpleGrid cols={3}>
			{list.map(image => (
				<ItemImage key={image.id} image={image} />
			))}
		</SimpleGrid>
	)
})

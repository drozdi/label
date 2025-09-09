import { Image, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { histroyAppend } from '../../entites/history/store'
import { storeImages } from '../../entites/images/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'

export const ItemImage = observer(({ image }) => {
	const { current } = storeTemplate
	const handleSelect = () => {
		storeTemplate.setImageId(image.id)
		histroyAppend(
			storeTemplate.objects,
			`Картинка "${current?.name}" - ${storeImages.findById(image.id)?.name}`
		)
		storeApp?.setImageFlag(false)
	}
	return (
		<Item active={current.image_id === image.id} onClick={handleSelect}>
			<Image
				src={'data:image/bmp;base64,' + image.data}
				alt={image.tag_images}
			/>
			<Title ta='center' order={6}>
				{image.name}
			</Title>
		</Item>
	)
})

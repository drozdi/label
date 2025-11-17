import { Image, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { storeApp } from '../../entites/app/store'
import { storeImages } from '../../entites/images/store'
import { storeTemplate } from '../../entites/template/store'
import { useHistory } from '../../services/history/hooks/use-history'
import { Item } from '../../shared/ui'

export const ItemImage = observer(
	({
		image,
	}: {
		image: {
			id: number
			name: string
			data: string
			tag_images: string
		}
	}) => {
		const current = storeTemplate.selectedObjects[0]
		const history = useHistory()
		useEffect(() => {
			if (!current) {
				storeApp.setImageFlag(false)
			}
		}, [current])
		const handleSelect = () => {
			storeTemplate.setImageId(image.id)
			history.append(storeTemplate.objects, `Картинка "${current?.name}" - ${storeImages.findById(image.id)?.name}`)
			storeApp.setImageFlag(false)
		}
		if (!current) {
			return ''
		}
		return (
			<Item active={current.image_id === image.id} onClick={handleSelect}>
				<Image src={'data:image/bmp;base64,' + image.data} alt={image.tag_images} />
				<Title ta='center' order={6}>
					{image.name}
				</Title>
			</Item>
		)
	}
)

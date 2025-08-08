import { Image, Title } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import classes from './Item.module.css'

export const ItemImage = observer(({ image }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const handleSelect = () => {
		storeTemplate.setImageId(image.id)
		ctx?.setImageFlag(false)
	}
	return (
		<div
			className={
				classes.root +
				(current.image_id === image.id ? ' ' + classes.active : '')
			}
			onClick={handleSelect}
		>
			<Image
				src={'data:image/bmp;base64,' + image.data}
				alt={image.tag_images}
			/>
			<Title ta='center' order={6}>
				{image.name}
			</Title>
		</div>
	)
})

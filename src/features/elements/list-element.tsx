import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import {
	TbBarcode,
	TbClipboardTypography,
	TbCodeDots,
	TbFileBarcode,
	TbImageInPicture,
	TbLine,
	TbMatrix,
	TbQrcode,
	TbRectangle,
	TbTextPlus,
} from 'react-icons/tb'
import { storeApp } from '../../entites/app/store'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { ItemElement } from './item-element'

export const ListElement = observer(() => {
	const elements = [
		{
			label: 'Текст (строка)',
			type: 'text',
			icon: <TbClipboardTypography />,
			data: 'Какойто текст',
			font_id: storeFonts.id || 1,
		},
		{
			label: 'Текст (многострочный)',
			type: 'block',
			icon: <TbTextPlus />,
			data: 'Какойто текст, много текста',
			font_id: storeFonts.id || 1,
		},
		{
			label: 'Переменная',
			type: 'text',
			data: '{barcode}',
			icon: <TbCodeDots />,
			font_id: storeFonts.id || 1,
			callback: () => {
				storeApp.setVariableFlag(true)
			},
		},
		{
			label: 'Data Matrix',
			name: storeDataMatrix.fakeBodyDM,
			type: 'barcode',
			icon: <TbMatrix />,
			code_type: 'datamatrix',
			data: '{barcode}',
			radius: 1.833,
			width: 6,
			height: 6,
			callback: () => {
				storeApp.setDataMatrixFlag(true)
			},
		},
		{
			label: 'EAN 13',
			name: 'EAN 13',
			type: 'barcode',
			icon: <TbBarcode />,
			code_type: 'ean13',
			human_readable: 0,
			radius: 1.833,
			width: 2,
			height: 10,
			data: '978020137962',
		},
		{
			label: 'code128',
			name: 'code128',
			type: 'barcode',
			icon: <TbFileBarcode />,
			code_type: 'code128',
			human_readable: 0,
			radius: 1.833,
			width: 2,
			height: 10,
			data: 'barcode046037210206',
		},
		{
			label: 'qrcode',
			name: 'barcode',
			type: 'barcode',
			icon: <TbQrcode />,
			code_type: 'qrcode',
			human_readable: 0,
			radius: 1.833,
			width: 10,
			height: 10,
			data: 'barcode046037210206',
		},
		{
			label: 'Изображение из бд',
			type: 'img',
			icon: <TbImageInPicture />,
			image_id: storeImages.id,
			callback: () => {
				storeApp.setImageFlag(true)
			},
		},
		{
			label: 'Линия',
			type: 'lines',
			icon: <TbLine />,
			width: 15,
			pos_x: 0,
			pos_y: 0,
			height: 1,
			line_thickness: 1,
		},
		{
			label: 'Бокс',
			type: 'box',
			icon: <TbRectangle />,
			radius: 0,
			line_thickness: 0.5,
			width: 15,
			height: 15,
		},
	]
	return (
		<Stack gap={2}>
			{elements.map(({ label, icon, callback, ...element }, index) => (
				<ItemElement key={index} label={label} icon={icon} component={Stack} callback={callback} element={element} />
			))}
		</Stack>
	)
})

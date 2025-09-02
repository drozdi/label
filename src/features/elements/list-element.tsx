import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { ItemElement } from './item-element'

export const ListElement = observer(() => {
	const elements = [
		{
			label: 'Текст (строка)',
			type: 'text',
			data: 'Какойто текст',
			font_id: storeFonts.id || 1,
		},
		{
			label: 'Текст (многострочный)',
			type: 'block',
			data: 'Какойто текст, много текста',
			font_id: storeFonts.id || 1,
		},
		{
			label: 'Data Matrix',
			name: storeDataMatrix.fakeBodyDM,
			type: 'barcode',
			code_type: 'datamatrix',
			data: '{barcode}',
			radius: 1.833,
			width: 6,
			height: 6,
			callback: ctx => {
				ctx?.setDataMatrixFlag(true)
			},
		},
		{
			label: 'EAN 13',
			name: 'EAN 13',
			type: 'barcode',
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
			image_id: storeImages.id,
		},
		{
			label: 'Линия',
			type: 'lines',
			width: 15,
			pos_x: 0,
			pos_y: 0,
			height: 1,
			line_thickness: 1,
		},
		{
			label: 'Бокс',
			type: 'box',
			radius: 0,
			line_thickness: 0.5,
			width: 15,
			height: 15,
		},
	]
	return (
		<Stack gap={2}>
			{elements.map(({ label, callback, ...element }, index) => (
				<ItemElement
					key={index}
					label={label}
					callback={callback}
					element={element}
				/>
			))}
		</Stack>
	)
})

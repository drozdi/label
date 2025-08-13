import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeFonts } from '../../entites/fonts/store'
import { storeImages } from '../../entites/images/store'
import { ItemElement } from './item-element'

const elements = [
	{
		label: 'Текст (строка)',
		type: 'text',
		data: 'Какойто текст',
		font_id: storeFonts.defaultFont?.id || 1,
		callback: ctx => {
			ctx?.setFontFamilyFlag(true)
		},
	},
	{
		label: 'Текст (многострочный)',
		type: 'block',
		data: 'Какойто текст, много текста',
		font_id: storeFonts.defaultFont?.id || 1,
		callback: ctx => {
			ctx?.setFontFamilyFlag(true)
		},
	},
	{
		label: 'Data Matrix',
		name: '0104603721020607215>(egerf3ukLfdK5r\u001d93zoJf',
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
		image_id: storeImages.defaultImage?.id || 1,
		callback: ctx => {
			ctx?.setImageFlag(true)
		},
	},
	{
		label: 'Линия',
		type: 'lines',
		width: 15,
		height: 1,
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

export const ListElement = observer(() => {
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

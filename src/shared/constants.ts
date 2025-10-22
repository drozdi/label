export const KEY_FONT_DEFAULT = 'default.font'
export const KEY_IMAGE_DEFAULT = 'default.image'
export const KEY_TIME_AUTO_SAVE = 'default.time.auto.save'
export const KEY_HISTORY_COUNT = 'default.history.count'
export const KEY_SCALE_DEFAULT = 'default.scale'
export const KEY_API_HOST = 'api.host'
export const KEY_API_TIMEOUT = 'api.timeout'

export const TIME_AUTO_SAVE = 120
export const HISTORY_COUNT = 30
export const TIMEOUT_API = 5
export const URL_API = 'http://10.76.10.102:8033/api/v1/'

export const MM = 3.709575175750246
//export const MM = 3.8
//export const MM = 3.7
export const CM = 37.09575175750246
//export const CM = 38
//export const CM = 37
export const MM_QR = 3.999575175750246
export const STEP = 0.1
export const ROUND = 10
export const SNAP_THRESHOLD = 5 //px
export const NEW_TEMPLATE_NAME = 'Новый шаблон'
export const WIDTH_MOBILE = 612
export const MEDIA_MOBILE = `(max-width: ${WIDTH_MOBILE}px)`

export const VERSION = '2.0.0'

export const DEF_TEMPLATE = {
	dpi: 12,
	width_mm: 58,
	height_mm: 40,
	radius_label: 5,
	gap_mm: 3,
	scale: 1,
	direction_x: 1,
	direction_y: 0,
	reference_x: 0,
	reference_y: 0,
	applicator_ezpl: null,
	objects: [],
}

export const FAKE_VARIBLES = {
	barcode: "~10103665585002190215'hX%t7Ir8FMl93dGVz",
	mandate: '30.06.2025',
	smandate: '25',
	lifetime: '36 мец',
	slifetime: '28',
	serial: '452457',
	shift: '3',
	batch: '25',
	boil: '352',
	factory: '31',
	gtin: '01234567891011',
	product: 'Название продукта',
	product0: 'Название',
	additional_text: 'Дополнительный',
	weight: '1,53',
	weight_g: '1530',
	package_size: '24',
	package_size_units: '12',
	ean13: '2245245015303',
	ean13_2: '111213245678',
	mandate_11: '250630',
	weight_3103: '001530',
	expdate_17: '250630',
	ean13barcode: '',
	batch_10: '0000000025',
	boil_10: '0000000352',
	pack_gtin: '01234567891011',
	pack_ean13barcode: '01234567891011',
	counter: '38',
	count: '39',
	sizing_s: '1530',
	sizing_l: '1,53',
	pack_name: 'Агрегат',
	cell: '35',
	taskid: '15',
}

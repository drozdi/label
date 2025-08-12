import { Button, Group, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { serviceNotifications } from '../../entites/notifications/service'
import { servicePrinter } from '../../entites/printer/service'
import { storePrinter } from '../../entites/printer/store'
import { ItemEditable } from './item-editable'
import { ItemOptions } from './item-options'

export const PrinterSettings = observer(({ setPrinterSetting }) => {
	const config = storePrinter.getConfig()
	const [port, setPort] = useState(config.port)
	const [host, setHost] = useState(config.host)
	const [count, setCount] = useState(config.number_labels)
	const [typePrinter, setTypePrinter] = useState(config.type_printer)
	const [printerResolution, setPrinterResolution] = useState(
		String(config.printer_resolution)
	)
	const [shiftX, setShiftX] = useState(config.SHIFT_X)
	const [shiftY, setShiftY] = useState(config.SHIFT_Y)

	useEffect(() => {
		setPort(config.port)
		setHost(config.host)
		setCount(config.number_labels)
		setTypePrinter(config.type_printer)
		setPrinterResolution(config.printer_resolution)
		setShiftX(config.SHIFT_X)
		setShiftY(config.SHIFT_Y)
	}, [config])

	const setValue = (value, func) => {
		func(value)
	}

	const handlePing = async () => {
		const res = await servicePrinter.ping(true)
		if (res === 'Готов к работе') {
			serviceNotifications.success(`Ответ от принтера. ${res}`)
		}
	}

	const handleCheckSettings = async () => {
		try {
			const res = await servicePrinter.getSettings()
			if (res === undefined) {
				return serviceNotifications.danger('Не удалось считать настройки')
			}
			const printer = { ...config }
			printer.printer_resolution = res.DPI ?? 300
			printer.VERSION = res.VERSION
			printer.CODEPAGE = res.CODEPAGE
			printer.SPEED = res.SPEED
			printer.DENSITY = res.DENSITY
			printer.SHIFT_X = res['SHIFT X']
			printer.SHIFT_Y = res['SHIFT Y']
			storePrinter.setConfig(printer)
		} catch (e) {
			console.error(e)
		}
	}

	const handleSaveSettings = async () => {
		const shift_X = config.SHIFT_X
		const shift_Y = config.SHIFT_Y

		const host_old = config.host
		const port_old = config.port
		const number_labels_old = config.number_labels
		const type_printer_old = config.type_printer
		const printer_resolution_old = config.printer_resolution

		storePrinter.setConfig({
			host,
			port,
			number_labels: count,
			type_printer: typePrinter,
			printer_resolution: printerResolution,
			DENSITY: storePrinter.DENSITY,
			SHIFT_X: shiftX,
			SHIFT_Y: shiftY,
		})

		if (
			host_old !== host ||
			Number(port_old) !== Number(port) ||
			Number(number_labels_old) !== Number(count) ||
			type_printer_old !== typePrinter ||
			Number(printer_resolution_old) !== Number(printerResolution)
		) {
			serviceNotifications.success('Настройки принтера успешно сохранены.')
		}
		if (
			Number(shift_X) !== Number(shiftX) ||
			Number(shift_Y) !== Number(shiftY)
		) {
			const settingsPrinter = {
				...storePrinter.getConfig(),
				shift: {
					x: Number(shiftX),
					y: Number(shiftY),
				},
			}
			const res = await servicePrinter.setSettings(settingsPrinter)
			console.log(res)
			if (!res) {
				serviceNotifications.error(
					'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
				)
				storePrinter.setConfig({
					SHIFT_X: shift_X,
					SHIFT_Y: shift_Y,
				})
			} else {
				serviceNotifications.success('Настройки смещения успешно сохранены.')
			} //*/
		}
	}

	return (
		<div className='setting_printing'>
			<Group w='100%' justify='space-between' gap='2rem'>
				<Stack w='65%'>
					<ItemEditable
						editable
						type='text'
						label='ip-адрес:'
						value={host}
						onChange={e => setValue(e, setHost)}
					/>
					<ItemEditable
						editable
						type='number'
						label='Порт:'
						value={port}
						onChange={e => setValue(e, setPort)}
					/>
					<ItemEditable
						editable
						type='number'
						label='Кол-во:'
						value={count}
						onChange={e => setValue(e, setCount)}
					/>
					<ItemOptions
						label='Тип принтера:'
						value={typePrinter}
						options={['tspl', 'ezpl']}
						onChange={setTypePrinter}
					/>
					<ItemOptions
						label='dpi:'
						value={printerResolution}
						options={['200', '300']}
						onChange={setPrinterResolution}
					/>
					<ItemEditable label='Версия ПО:' value={storePrinter.VERSION} />
					<ItemEditable
						editable
						type='number'
						label='Смещение ТПГ по X:'
						value={shiftX}
						onChange={e => setValue(e, setShiftX)}
					/>
					<ItemEditable
						editable
						type='number'
						label='Смещение ТПГ по Y:'
						value={shiftY}
						onChange={e => setValue(e, setShiftY)}
					/>
					<ItemEditable
						label='Плотность печати:'
						value={storePrinter.DENSITY}
					/>
					<ItemEditable label='Скорость печати:' value={storePrinter.SPEED} />
					<ItemEditable
						label='Страница кодировки:'
						value={storePrinter.CODEPAGE}
					/>
				</Stack>
				<Stack align='stretch' justify='space-between' w='10rem' h='100%'>
					<Stack align='stretch' justify='flex-start' gap='1rem'>
						<Button variant='outline' onClick={handleCheckSettings}>
							Считать настройки
						</Button>
						<Button variant='outline'>Калибровка</Button>
						<Button variant='outline' onClick={handlePing}>
							Проверка связи
						</Button>
					</Stack>
					<Button variant='outline' onClick={handleSaveSettings}>
						Сохранить
					</Button>
				</Stack>
			</Group>
		</div>
	)
})

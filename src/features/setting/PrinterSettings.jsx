import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { storeMessage } from '../../entites/messege/store'
import { storePrinter } from '../../entites/printer/store'
import service from '../../request/service'
import Memory from '../../store/Memory'

import { Btn, Group, List, Stack } from '../../shared/ui'
import { SettingRow } from './SettingRow'
import { SettingRowOptions } from './SettingRowOptions'

export const PrinterSettings = observer(({ setPrinterSetting }) => {
	const conf = storePrinter.getConfig()
	useEffect(() => {
		writeOptionsSettingsPrinter()
	}, [])
	const [host, setHost] = useState('')
	const [hostFlag, setHostFlag] = useState(false)

	const [port, setPort] = useState('')
	const [portFlag, setPortFlag] = useState(false)
	const [count, setCount] = useState('')
	const [countFlag, setCountFlag] = useState(false)
	const [densityFlag, setDensityFlag] = useState(false)
	const [shiftXFlag, setshiftXFlag] = useState(false)
	const [shiftYFlag, setshiftYFlag] = useState(false)

	const [typePrinter, setTypePrinter] = useState('')
	const [printerResolution, setPrinterResolution] = useState('300')
	const [version, setVersion] = useState('')
	const [codepage, setCodepage] = useState('')
	const [density, setDensity] = useState('')
	const [shiftX, setShiftX] = useState('')
	const [shiftY, setShiftY] = useState('')
	const [speed, setSpeed] = useState('')

	const setPrinterSettings = () => {
		setshiftXFlag(false)
		setshiftYFlag(false)
		setHostFlag(false)
		setPortFlag(false)
		setCountFlag(false)
		setDensityFlag(false)
	}
	const selectDpiPrinter = e => {
		setPrinterResolution(e.target.value)
	}
	const setValue = (e, func) => {
		func(e.target.value)
	}

	const checkSettingsPrinter = async () => {
		try {
			const res = await service.getSettingsPrinter()
			if (res === undefined) {
				return storeMessage.error('Не удалось считать настройки')
			}

			storePrinter.setConfig({
				printer_resolution: res.DPI ?? 300,
				VERSION: res.VERSION,
				CODEPAGE: res.CODEPAGE,
				SPEED: res.SPEED,
				DENSITY: res.DENSITY,
				SHIFT_X: res['SHIFT X'],
				SHIFT_Y: res['SHIFT Y'],
			})

			writeOptionsSettingsPrinter()
		} catch (e) {
			console.error(e)
		}
	}

	const writeOptionsSettingsPrinter = () => {
		const printer = storePrinter.getConfig()
		setHost(printer.host)
		setPort(printer.port)
		setTypePrinter(printer.type_printer)
		setPrinterResolution(printer.printer_resolution)
		setCount(printer.number_labels)
		setVersion(printer.VERSION)
		setCodepage(printer.CODEPAGE)
		setDensity(printer.DENSITY)
		setShiftX(printer.SHIFT_X)
		setShiftY(printer.SHIFT_Y)
		setSpeed(printer.SPEED)
	}

	const settingsPrinter = {
		host: storePrinter.host,
		port: storePrinter.port,
		type_printer: storePrinter.type_printer,
	}

	const rewritPrinting = () => {
		storePrinter.setConfig({
			host,
			port,
			number_labels: count,
			type_printer: typePrinter,
			printer_resolution: printerResolution,
			DENSITY: density,
			SHIFT_X: shiftX,
			SHIFT_Y: shiftY,
		})

		settingsPrinter.host = storePrinter.host
		settingsPrinter.port = storePrinter.port
		settingsPrinter.type_printer = storePrinter.type_printer
	}

	const savePrinter = async () => {
		const shift_X = storePrinter.SHIFT_X
		const shift_Y = storePrinter.SHIFT_Y

		const host_old = storePrinter.host
		const port_old = storePrinter.port
		const number_labels_old = storePrinter.number_labels
		const type_printer_old = storePrinter.type_printer
		const printer_resolution_old = storePrinter.printer_resolution

		storePrinter.setConfig({
			host,
			port,
			number_labels: count,
			type_printer: typePrinter,
			printer_resolution: printerResolution,
			DENSITY: density,
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
			storeMessage.success('Настройки принтера успешно сохранены.')
		}
		if (
			Number(shift_X) !== Number(shiftX) ||
			Number(shift_Y) !== Number(shiftY)
		) {
			settingsPrinter.shift = {
				x: Number(shiftX),
				y: Number(shiftY),
			}
			const res = await service.setSettingsPrinter(settingsPrinter)
			if (!res) {
				storeMessage.error(
					'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
				)
				storePrinter.setConfig({
					SHIFT_X: shift_X,
					SHIFT_Y: shift_Y,
				})
			} else {
				storeMessage.success('Настройки смещения успешно сохранены.')
			}
		}
	}

	const getPingPrint = async () => {
		if (!storePrinter.loadConfig()) {
			return setPrinterSetting(true)
		}
		await service.pingPrinter()
	}

	const printCalibration = async () => {
		rewritPrinting()
		settingsPrinter.calibration = true
		const res = await service.setSettingsPrinter(settingsPrinter)
		if (!res) {
			storeMessage.error(
				'Не удалось применить новые настройки. Ответ от принтера не получен. Возможные ошибки: 1. Неверные параметры настройки принтера, в редакторе этикеток. 2. Принтер выключен. 3. На принтере отсутствует подключение к локальной сети'
			)
		}
	}

	return (
		<div className='setting_printing'>
			<Group justify='center' style={{ width: '100%' }} gap='2rem'>
				<List style={{ width: '100%', maxWidth: 450 }}>
					<SettingRow
						editing
						type='text'
						label='ip-адрес:'
						value={host}
						onChange={e => setValue(e, setHost)}
						onClick={() => setPrinterSettings('host', host)}
					/>
					<SettingRow
						editing
						type='number'
						label='Порт:'
						value={port}
						onChange={e => setValue(e, setPort)}
						onClick={() => setPrinterSettings('port', port)}
					/>
					<SettingRow
						editing
						type='number'
						label='Кол-во:'
						value={count}
						onChange={e => setValue(e, setCount)}
						onClick={() => setPrinterSettings('number_labels', count)}
					/>
					<SettingRowOptions
						label='Тип принтера:'
						value={typePrinter}
						options={[
							{
								value: 'tspl',
								label: 'tspl',
							},
							{
								value: 'ezpl',
								label: 'ezpl',
							},
						]}
						onChange={setTypePrinter}
					/>
					{Memory.visible_printer_settings ? (
						<>
							<SettingRowOptions
								label='dpi:'
								value={printerResolution}
								options={[
									{
										value: 200,
										label: '200',
									},
									{
										value: 300,
										label: '300',
									},
								]}
								onChange={setPrinterResolution}
							/>
							<SettingRow label='Версия ПО:' value={version} />
							<SettingRow
								editing
								type='number'
								label='Смещение ТПГ по X:'
								value={shiftX}
								onChange={e => setValue(e, setShiftX)}
								onClick={() => setPrinterSettings('SHIFT_X', shiftX)}
							/>
							<SettingRow
								editing
								type='number'
								label='Смещение ТПГ по Y:'
								value={shiftY}
								onChange={e => setValue(e, setShiftY)}
								onClick={() => setPrinterSettings('SHIFT_Y', shiftY)}
							/>
							<SettingRow label='Плотность печати:' value={density} />
							<SettingRow label='Скорость печати:' value={speed} />
							<SettingRow label='Страница кодировки:' value={codepage} />
						</>
					) : (
						<></>
					)}
				</List>
				<Stack justify='between' style={{ width: 160, height: '100%' }}>
					<Stack justify='start' gap='1rem'>
						<Btn outline onClick={checkSettingsPrinter}>
							Считать настройки
						</Btn>
						<Btn outline onClick={printCalibration}>
							Калибровка
						</Btn>
						<Btn outline onClick={getPingPrint}>
							Проверка связи
						</Btn>
					</Stack>
					<Btn outline onClick={savePrinter}>
						Сохранить
					</Btn>
				</Stack>
			</Group>
		</div>
	)
})

import { Button, Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { storeApp } from '../../entites/app/store'
import { URL_API, VERSION } from '../../shared/constants'
import { ItemEditable } from './item-editable'
export const AppSettings = observer(() => {
	const [apiHostFlag, setApiHostFlag] = useState(false)
	const [apiPortFlag, setApiPortFlag] = useState(false)
	const [timeAutoSave, setTimeAutoSave] = useState(storeApp.timeAutoSave)
	const [historyCount, setHistoryCount] = useState(storeApp.historyCount)
	const [apiHost, setApiHost] = useState(localStorage.getItem('api.host') || URL_API)
	const [apiSplit, setApiSplit] = useState(apiHost.replace('http://', '').replace('/api/v1/', '').split(':'))
	const handleApiHost = (i, val) => {
		if (i === 0) {
			setApiSplit([val, apiSplit[1]])
		} else if (i === 1) {
			setApiSplit([apiSplit[0], val])
		}
	}

	useEffect(() => {
		setApiSplit(apiHost.replace('http://', '').replace('/api/v1/', '').split(':'))
	}, [apiHost])

	const setApi = () => {
		const newApiHost = `http://${apiSplit.join(':')}/api/v1/`
		setApiHost(newApiHost)
		setApiHostFlag(false)
		setApiPortFlag(false)
		localStorage.setItem('api.host', newApiHost)
		window.location.reload()
	}

	return (
		<Stack>
			<ItemEditable
				editable
				type='text'
				label='Адрес БД:'
				value={apiSplit[0]}
				edit={apiHostFlag}
				onChange={value => handleApiHost(0, value)}
				onClick={() => setApi()}
				onEdit={edit => {
					setApiPortFlag(edit)
				}}
			/>
			<ItemEditable
				editable
				type='number'
				label='Порт БД:'
				value={apiSplit[1]}
				edit={apiPortFlag}
				onChange={value => handleApiHost(1, value)}
				onClick={() => setApi()}
				onEdit={edit => {
					setApiHostFlag(edit)
				}}
			/>
			<ItemEditable
				editable
				type='text'
				label='Время автосохранения (с):'
				value={timeAutoSave}
				onChange={value => setTimeAutoSave(value)}
				onClick={() => storeApp.setTimeAutoSave(timeAutoSave)}
			/>
			<ItemEditable
				editable
				type='text'
				label='Кол-во пунктов истории:'
				value={historyCount}
				onChange={value => setHistoryCount(value)}
				onClick={() => storeApp.setHistoryCount(historyCount)}
			/>
			<ItemEditable type='text' label='Версия:' value={VERSION} />
			<Button onClick={() => storeApp.setDefaultSettings(true)}>Сбросить настройки</Button>
		</Stack>
	)
})

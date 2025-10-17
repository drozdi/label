import { Button, Center, NumberInput, Stack, TextInput } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeApp } from '../entites/app/store'
import { KEY_API_HOST, KEY_API_TIMEOUT, TIMEOUT_API, URL_API } from '../shared/constants'

export const DefaultSettings = observer(() => {
	const [timeAutoSave, setTimeAutoSave] = useState(storeApp.timeAutoSave)
	const [historyCount, setHistoryCount] = useState(storeApp.historyCount)
	const [apiHost, setApiHost] = useState(localStorage.getItem(KEY_API_HOST) || URL_API)
	const [apiSplit, setApiSplit] = useState(apiHost.replace('http://', '').replace('/api/v1/', '').split(':'))
	const [apiTimeout, setApiTimeout] = useState(Number(localStorage.getItem(KEY_API_TIMEOUT) || TIMEOUT_API))
	const handleApiHost = (i, val) => {
		if (i === 0) {
			setApiSplit([val, apiSplit[1]])
		} else if (i === 1) {
			setApiSplit([apiSplit[0], val])
		}
	}
	const handleSave = () => {
		const api = `http://${apiSplit[0]}:${apiSplit[1]}/api/v1/`
		localStorage.setItem(KEY_API_HOST, api)
		localStorage.setItem(KEY_API_TIMEOUT, String(apiTimeout))
		storeApp.setTimeAutoSave(timeAutoSave)
		storeApp.setHistoryCount(historyCount)
		window.location.reload()
	}
	return (
		<Center w='100%' h='100%'>
			<Stack w={300}>
				<TextInput
					label='Адрес БД:'
					placeholder='127.0.0.1'
					value={apiSplit[0]}
					onChange={({ target }) => handleApiHost(0, target.value)}
				/>
				<NumberInput
					label='Порт БД:'
					placeholder='8033'
					value={apiSplit[1]}
					onChange={value => handleApiHost(1, value)}
				/>
				<NumberInput
					label='Время отклика (с):'
					placeholder='5'
					value={apiTimeout}
					onChange={value => setApiTimeout(value)}
				/>
				<NumberInput
					label='Время автосохранения (с):'
					placeholder='30'
					value={timeAutoSave}
					onChange={value => setTimeAutoSave(value)}
				/>
				<NumberInput
					label='Кол-во пунктов истории:'
					placeholder='30'
					value={historyCount}
					onChange={value => setHistoryCount(value)}
				/>
				<Button onClick={handleSave}>Сохранить</Button>
			</Stack>
		</Center>
	)
})

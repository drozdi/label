import { Stack } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { URL_API, VERSION } from '../../shared/constants'
import { ItemEditable } from './item-editable'
export const AppSettings = observer(() => {
	const setThemeFunc = async () => {}
	const [apiHostFlag, setApiHostFlag] = useState(false)
	const [apiPortFlag, setApiPortFlag] = useState(false)
	const [apiHost, setApiHost] = useState(
		localStorage.getItem('api.host') || URL_API
	)
	const [apiSplit, setApiSplit] = useState(
		apiHost.replace('http://', '').replace('/api/v1/', '').split(':')
	)
	const handleApiHost = (i, val) => {
		if (i === 0) {
			setApiSplit([val, apiSplit[1]])
		} else if (i === 1) {
			setApiSplit([apiSplit[0], val])
		}
	}

	useEffect(() => {
		setApiSplit(
			apiHost.replace('http://', '').replace('/api/v1/', '').split(':')
		)
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
				onChange={value => handleApiHost(0, value)}
				onClick={() => setApi()}
			/>
			<ItemEditable
				editable
				type='text'
				label='Порт БД:'
				value={apiSplit[1]}
				onChange={value => handleApiHost(1, value)}
				onClick={() => setApi()}
			/>
			<ItemEditable type='text' label='Версия:' value={VERSION} />
		</Stack>
	)
})

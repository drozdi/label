import { Button, Center, Stack, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { TbFaceIdError } from 'react-icons/tb'
import { storeApp } from '../entites/app/store'
import { URL_API } from '../shared/constants'

export const ErrorServer = () => {
	const [apiHost, setApiHost] = useState(localStorage.getItem('api.host') || URL_API)
	const setApi = host => {
		localStorage.setItem('api.host', host)
		window.location.reload()
	}

	return (
		<Center w='100%' h='100%'>
			<Stack align='center'>
				<TbFaceIdError size={100} color='var(--mantine-color-red-5)' />
				<Title order={2}>Сервер этикеток недоступен попробуйте позже</Title>
				<Title order={4}>Настройки api</Title>
				<TextInput
					value={apiHost}
					w='100%'
					size='xl'
					variant='underline'
					onChange={({ target }) => setApiHost(target.value)}
				/>
				<Button variant='filled' onClick={() => setApi(apiHost)}>
					Обновить
				</Button>
				<Button variant='filled' onClick={() => storeApp.setDefaultSettings(true)}>
					Сбросить настройки
				</Button>
			</Stack>
		</Center>
	)
}

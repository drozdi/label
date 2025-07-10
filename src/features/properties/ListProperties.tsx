import { Stack } from '@mantine/core'
import { ItemEditable } from './ItemEditable'
import { ItemField } from './ItemField'
import { ItemOptions } from './ItemOptions'

export function ListProperties() {
	return (
		<Stack maw='auto' gap={0}>
			<ItemEditable
				editable
				label='Имя:'
				value={'name'}
				placeholder='введите имя'
				type='text'
				onChange={e => console.log(e.target.value)}
				onClick={() => console.log('click')}
			/>
			<ItemField
				edit
				label='Высота:'
				type='number'
				value={25}
				unit='mm'
				onChange={e => console.log(e.target.value)}
			/>
			<ItemOptions
				label='Поворот:'
				unit='%'
				options={['0', '90', '180', '270']}
				onChange={console.log}
				value='90'
			/>
		</Stack>
	)
}

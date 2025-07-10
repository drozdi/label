import { Stack } from '@mantine/core'
import { ItemEditable } from './ItemEditable'
import { ItemField } from './ItemField'
import { ItemNumber } from './ItemNumber'

export function ListProperties() {
	return (
		<Stack maw="auto">
			<ItemNumber label='X:' value="" unit='mm' />
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
		</Stack>
	)
}
import { Stack } from '@mantine/core'
import { ItemNumber } from './ItemNumber'

export function ListProperties() {
	return (
		<Stack maw="auto">
			<ItemNumber label='X:' value="" unit='mm' />
		</Stack>
	)
}
import { Box, Group, Stack, Switch, Text } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import classes from './Switch.module.css'

export const ListLayers = observer(() => {
	const { objects } = storeTemplate
	const handleClick = (event: React.MouseEvent, element) => {
		if (event.ctrlKey) {
			storeTemplate.selectObject(element.id)
		} else {
			storeTemplate.setActiveObject(element.id)
		}
	}
	return (
		<Stack>
			{objects.map((object, index) => (
				<Group grow justify='flex-end' key={object.id} c={storeTemplate.isSelected(object.id) ? 'green' : ''}>
					<Text
						truncate='end'
						maw='75%'
						onClick={event => handleClick(event, object)}
						style={{
							userSelect: 'none',
							cursor: 'pointer',
						}}
					>
						{['text', 'block'].includes(object.type)
							? object.data
							: object.type === 'img'
							? 'Картинка: ' + object.imageName
							: object.name}
					</Text>
					<Box>
						<Switch
							color={storeTemplate.isSelected(object.id) ? 'green' : ''}
							labelPosition='left'
							checked={object.enabled}
							classNames={classes}
							onChange={event => {
								storeTemplate.toggleEnabled(object.id)
							}}
						/>
					</Box>
				</Group>
			))}
		</Stack>
	)
})

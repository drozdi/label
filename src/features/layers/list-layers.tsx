import { Stack, Switch } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import classes from './Switch.module.css'

export const ListLayers = observer(() => {
	const { objects } = storeTemplate
	return (
		<Stack>
			{objects.map((object, index) => (
				<Switch
					key={object.id}
					color={storeTemplate.selected.includes(object.id) ? 'green' : ''}
					label={object.name}
					labelPosition='left'
					checked={object.enabled}
					classNames={classes}
					onClick={() => storeTemplate.setActiveObject(object.id)}
					onChange={() => storeTemplate.toggleEnabled(object.id)}
				/>
			))}
		</Stack>
	)
})

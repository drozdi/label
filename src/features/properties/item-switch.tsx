import { Box, Group, Switch } from '@mantine/core'
import classes from './Switch.module.css'

interface ItemSwitchProps {
	label?: string
	checked?: boolean
	unit?: string
	placeholder?: string
	onChange?: (e: React.MouseEvent) => void
	edit?: boolean
	[key: string]: any
}

export function ItemSwitch({
	label,
	edit,
	unit,
	checked = false,
	onChange,
	...other
}: ItemSwitchProps) {
	return (
		<Group gap={0} grow>
			<Box maw='50%'>{label}</Box>
			<Box flex='auto' ta='right' maw={`${100 - 50}%`}>
				{edit ? (
					<Switch
						{...other}
						checked={checked}
						classNames={classes}
						onChange={e => onChange?.(e.target.checked)}
					/>
				) : checked ? (
					'Активный'
				) : (
					'Неактивный'
				)}
			</Box>
		</Group>
	)
}

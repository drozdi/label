import { useState } from 'react'
import { Item, ItemSection, Options } from '../../shared/ui'

export const SettingRowOptions = ({
	name,
	label,
	value,
	onChange,
	options,
}) => {
	const [edit, setEdit] = useState(false)
	return (
		<Item dense>
			<ItemSection>{label}</ItemSection>
			<ItemSection end>
				<Options
					inline
					name={name}
					value={value}
					options={options}
					onChange={onChange}
				/>
			</ItemSection>
		</Item>
	)
}

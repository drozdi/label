import { useState } from 'react'
import { Btn, Input, Item, ItemSection } from '../../shared/ui'

export const SettingRow = ({
	label,
	type,
	placeholder,
	value,
	onChange,
	onClick,
	editing,
}) => {
	const [edit, setEdit] = useState(false)
	return (
		<Item dense>
			<ItemSection>{label}</ItemSection>
			{edit && editing ? (
				<>
					<ItemSection end>
						<Input
							dense
							underline
							type={type}
							placeholder={placeholder}
							value={value}
							onChange={onChange}
						/>
					</ItemSection>
					<ItemSection side>
						<Btn
							outline
							onClick={(...args) => {
								onClick?.(...args)
								setEdit(false)
							}}
						>
							Ок
						</Btn>
					</ItemSection>
				</>
			) : (
				<ItemSection
					end
					onClick={() => setEdit(true)}
					style={
						editing
							? { cursor: 'pointer', color: 'var(--color-secondary)' }
							: {}
					}
				>
					{value}
				</ItemSection>
			)}
		</Item>
	)
}

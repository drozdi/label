import { CloseButton } from '@mantine/core'
import clsx from 'clsx'
import { TbX } from 'react-icons/tb'
import classes from './item.module.css'

export const Item = ({
	active,
	children,
	className,
	disabled,
	onRemove,
	...props
}: Record<string, any>) => {
	return (
		<div
			{...props}
			className={clsx(
				classes.root,
				{
					[classes.active]: active,
					[classes.disabled]: disabled,
				},
				className
			)}
		>
			{onRemove && (
				<CloseButton
					pos='absolute'
					right='0'
					top='0'
					color='red'
					icon={<TbX color='red' />}
					onClick={event => {
						event.stopPropagation()
						onRemove?.()
					}}
				></CloseButton>
			)}
			{children}
		</div>
	)
}

import clsx from 'clsx'
import classes from './item.module.css'

export const Item = ({
	active,
	children,
	className,
	...props
}: Record<string, any>) => {
	return (
		<div
			{...props}
			className={clsx(
				classes.root,
				{
					[classes.active]: active,
				},
				className
			)}
		>
			{children}
		</div>
	)
}

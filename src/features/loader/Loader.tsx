import { LoadingOverlay } from '@mantine/core'
import classes from './spin.module.css'

export function Loader({ visible }) {
	return (
		<LoadingOverlay
			visible={visible}
			zIndex={1000}
			overlayProps={{ radius: 'sm', blur: 2 }}
			loaderProps={{ children: <div className={classes.spinner}></div> }}
		/>
	)
}

import { LoadingOverlay } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import classes from './spin.module.css'

export const Loader = observer(({ visible }: { visible: boolean }) => {
	if (!storeApp.showAppLoader) {
		return ''
	}
	return (
		<LoadingOverlay
			visible={visible}
			zIndex={1000}
			overlayProps={{ radius: 'xs', blur: 2 }}
			loaderProps={{ children: <div className={classes.spinner}></div> }}
		/>
	)
})

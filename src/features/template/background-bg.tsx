import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import classes from './background.module.css'

export const BackgroundBg = observer(() => {
	const { imageBg } = storeApp
	if (!imageBg) {
		return null
	}
	return (
		<div className={classes.bg}>
			<img src={imageBg} />
		</div>
	)
})

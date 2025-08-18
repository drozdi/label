import { observer } from 'mobx-react-lite'
import { useAppContext } from '../context'
import classes from './background.module.css'

export const BackgroundBg = observer(() => {
	const { imageBg } = useAppContext()
	if (!imageBg) {
		return null
	}
	return (
		<div className={classes.bg}>
			<img src={imageBg} />
		</div>
	)
})

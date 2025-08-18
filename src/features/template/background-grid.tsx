import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import classes from './background.module.css'

export const BackgroundGrid = observer(() => {
	const { gridFlag } = useAppContext()
	if (!gridFlag) {
		return null
	}
	return (
		<div
			className={classes.grid}
			style={{
				backgroundSize: `${storeTemplate.mm * storeTemplate.scale}px ${
					storeTemplate.mm * storeTemplate.scale
				}px, ${storeTemplate.mm * storeTemplate.scale}px ${
					storeTemplate.mm * storeTemplate.scale
				}px, ${storeTemplate.cm * storeTemplate.scale}px ${
					storeTemplate.cm * storeTemplate.scale
				}px, ${storeTemplate.cm * storeTemplate.scale}px ${
					storeTemplate.cm * storeTemplate.scale
				}px`,
			}}
		></div>
	)
})

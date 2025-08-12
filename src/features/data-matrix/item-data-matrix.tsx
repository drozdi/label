import { observer } from 'mobx-react-lite'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeTemplate } from '../../entites/template/store'
import { useAppContext } from '../context'
import styles from './Item.module.css'

export const ItemDataMatrix = observer(({ dataMatrix }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const handleSelect = async () => {
		storeTemplate.setName(await storeDataMatrix.selectedDM(dataMatrix))
		ctx?.setDataMatrixFlag(false)
	}
	return (
		<div className={styles.root} onClick={handleSelect}>
			{dataMatrix.name}
		</div>
	)
})

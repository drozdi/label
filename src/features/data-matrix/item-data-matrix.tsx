import { observer } from 'mobx-react-lite'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'
import { useAppContext } from '../context'

export const ItemDataMatrix = observer(({ dataMatrix }) => {
	const { current } = storeTemplate
	const ctx = useAppContext()
	const handleSelect = async () => {
		const dm = await storeDataMatrix.selectedDM(dataMatrix)
		storeTemplate.setName(dm.dm)
		storeTemplate.setRadius(dm.size / storeTemplate.dpi)
		ctx?.setDataMatrixFlag(false)
	}
	return <Item onClick={handleSelect}>{dataMatrix.name}</Item>
})

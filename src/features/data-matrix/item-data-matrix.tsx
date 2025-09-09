import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'

export const ItemDataMatrix = observer(({ dataMatrix }) => {
	const { current } = storeTemplate
	const handleSelect = async () => {
		const dm = await storeDataMatrix.selectedDM(dataMatrix)
		storeTemplate.setName(dm.dm)
		storeTemplate.setRadius(dm.size / storeTemplate.dpi)
		storeApp?.setDataMatrixFlag(false)
	}
	return <Item onClick={handleSelect}>{dataMatrix.name}</Item>
})

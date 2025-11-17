import { observer } from 'mobx-react-lite'
import { storeApp } from '../../entites/app/store'
import { storeDataMatrix } from '../../entites/data-matrix/store'
import { storeTemplate } from '../../entites/template/store'
import { Item } from '../../shared/ui'

export const ItemDataMatrix = observer(({ dataMatrix }: { dataMatrix: Record<string, any> }) => {
	const handleSelect = async () => {
		let flag = false
		const dm = await storeDataMatrix.selectedDM(dataMatrix)
		storeTemplate.setName(dm.dm)
		storeTemplate.setRadius(dm.size / storeTemplate.dpi)
		storeTemplate.setTemp(false)
		for (const object of storeTemplate.objects) {
			if (object.type === 'barcode' && object.code_type === 'datamatrix' && object.temp) {
				flag = true
				storeTemplate.setActiveObject(object.id)
				break
			}
		}
		storeApp?.setDataMatrixFlag(flag)
	}
	return <Item onClick={handleSelect}>{dataMatrix.name}</Item>
})

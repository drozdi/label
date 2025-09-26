import { observer } from 'mobx-react-lite'
import { storeGuideLine } from '../../../entites/guide-line/store'
import { storeTemplate } from '../../../entites/template/store'
import { Toolbar } from '../../../shared/ui'
import { LabelTolbarInput } from '../label/label-tolbar-input'

const w = 60

export const ToolbarGuideLine = observer(({ disabled, ...props }) => {
	storeTemplate
	return (
		<Toolbar fz={12} {...props}>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Отступ'
				name='gap'
				value={storeGuideLine.gap}
				onChange={v => {
					storeGuideLine.setGap(v)
				}}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Кол-во'
				name='num'
				value={storeGuideLine.num}
				onChange={v => {
					storeGuideLine.setNum(v)
				}}
			/>
		</Toolbar>
	)
})

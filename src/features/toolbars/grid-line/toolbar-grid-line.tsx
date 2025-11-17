import { observer } from 'mobx-react-lite'
import { storeTemplate } from '../../../entites/template/store'
import { Toolbar } from '../../../shared/ui'
import { LabelTolbarInput } from '../label/label-tolbar-input'

const w = 60

export const ToolbarGuideLine = observer(({ disabled, ...props }: { disabled?: boolean; [key: string]: any }) => {
	return (
		<Toolbar fz={12} {...props}>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Отступ'
				name='gap'
				value={storeTemplate.indent_mm}
				onChange={v => storeTemplate.changeIndent(v)}
			/>
			<LabelTolbarInput
				disabled={disabled}
				w={w}
				label='Кол-во'
				name='num'
				value={storeTemplate.num}
				onChange={v => storeTemplate.setNum(v)}
			/>
		</Toolbar>
	)
})

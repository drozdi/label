import { Group, Modal, NumberInput, Slider } from '@mantine/core'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { storeTemplate } from '../../entites/template/store'
import { Preview as PreviewClass } from '../../entites/templates/preview'
import { useAppContext } from '../context'
import { Element } from '../element/element'

const w = 50

export const Preview = observer(() => {
	const ctx = useAppContext()
	const [scale, setScale] = useState(1)

	const template = new PreviewClass(storeTemplate)
	template.setScale(scale)

	return (
		<Modal
			title='Предпросмотр'
			size='auto'
			opened={ctx?.previewFlag}
			onClose={() => ctx?.setPreviewFlag?.(false)}
		>
			<Slider
				defaultValue={scale}
				showLabelOnHover={true}
				min={1}
				max={4}
				step={0.01}
				label={value => `${Math.round(value * 100)}`}
				marks={[
					{ value: 1, label: '100%' },
					{ value: 1.5, label: '150%' },
					{ value: 2, label: '200%' },
					{ value: 2.5, label: '250%' },
					{ value: 3, label: '300%' },
					{ value: 3.5, label: '350%' },
					{ value: 4, label: '400%' },
				]}
				mb='xl'
				mx='-10px'
				w='100%'
				onChange={value => setScale(Math.round(value * 100) / 100)}
			/>
			<Group gap={0} mb='xs' justify='flex-end'>
				Направление:
				<NumberInput
					w={w}
					min={0}
					max={1}
					value={storeTemplate.direction_x}
					onChange={v => storeTemplate.changeDirection1?.(v)}
				/>
				,
				<NumberInput
					w={w}
					min={0}
					max={1}
					value={storeTemplate.direction_y}
					onChange={v => storeTemplate.changeDirection2?.(v)}
				/>
			</Group>
			<div
				style={{
					rotate: template.direction_x === 0 ? '0deg' : '180deg',
					transform:
						template.direction_y === 0 ? 'scale(1, 1)' : 'scale(-1, 1)',
				}}
			>
				<div
					style={{
						rotate: '180deg',
					}}
				>
					<div
						style={{
							background: '#fff',
							overflow: 'hidden',
							border: '1px solid #c3bfbf',
							height: template?.height,
							width: template?.width,
							borderRadius: template?.borderRadius,
							position: 'relative',
						}}
					>
						<div
							style={{
								overflow: 'hidden',
								position: 'relative',
								height: template?.height,
								width: template?.width,
								borderRadius: template?.borderRadius,
								marginLeft: template.referenceX,
								marginTop: template.referenceY,
								color: '#000000',
							}}
						>
							{template.objects.map((object, index) => (
								<Element
									preview
									scale={template.scale}
									key={object.id}
									index={index}
									object={object}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
})

import { Code, Group, Stack } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

export function App() {
	const refSS = useRef<HTMLDivElement>(null)
	const refS1 = useRef<HTMLDivElement>(null)
	const [sss, setSSS] = useState({})
	const [ss1, setSS1] = useState({})
	const width = 120
	const height = 20
	const x = 30
	const y = 20
	const rotate = 90
	const ss = {
		position: 'absolute',
		left: x,
		top: y,
		width,
		height,
		background: '#ff000050',
	}
	const s1 = {
		...ss,
		left: x - (rotate === 90 || rotate === 270 ? (width - height) / 2 : 0),
		top: y + (rotate === 90 || rotate === 270 ? (width - height) / 2 : 0),
		background: '#0000ff5b',
		rotate: `${rotate}deg`,
	}
	useEffect(() => {
		if (refSS.current) {
			setSSS(refSS.current?.getBoundingClientRect())
		}
		if (refS1.current) {
			setSS1(refS1.current?.getBoundingClientRect())
		}
	}, [])
	return (
		<div>
			<Stack>
				<Group h={200} gap={5}>
					<span style={ss} ref={refSS}>
						Text 1
					</span>
					<span style={s1} ref={refS1}>
						Text 2
					</span>
				</Group>
				<Stack p={20}>
					<div>ss</div>
					<Code>{JSON.stringify(sss)}</Code>
					<div>s1</div>
					<Code>{JSON.stringify(ss1)}</Code>
				</Stack>
			</Stack>
		</div>
	)
}

import { Code, Group, Stack } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'

export function App() {
	const refSS = useRef<HTMLDivElement>(null)
	const refS1 = useRef<HTMLDivElement>(null)
	const refSS_ = useRef<HTMLDivElement>(null)
	const refS1_ = useRef<HTMLDivElement>(null)
	const refS1__ = useRef<HTMLDivElement>(null)
	const [sss, setSSS] = useState({})
	const [ss1, setSS1] = useState({})
	const [sss_, setSSS_] = useState({})
	const [ss1_, setSS1_] = useState({})
	const [ss1__, setSS1__] = useState({})
	const width = 120
	const height = 20
	const x = 30
	const y = 20
	const rotate = 90
	const wrapS = {
		outline: '1px solid #0000ff5b',
	}
	const ss = {
		position: 'absolute',
		left: x,
		top: y,
		//width,
		//height,
		background: '#ff000050',
	}
	const s1 = {
		...ss,
		background: '#0000ff5b',
		transformOrigin: 'top left',
		rotate: `${rotate}deg`,
	}
	useEffect(() => {
		if (refSS.current) {
			setSSS(refSS.current?.getBoundingClientRect())
		}
		if (refS1.current) {
			setSS1(refS1.current?.getBoundingClientRect())
		}
		if (refSS_.current) {
			setSSS_(refSS_.current?.getBoundingClientRect())
		}
		if (refS1_.current) {
			setSS1_(refS1_.current?.getBoundingClientRect())
		}
		if (refS1__.current) {
			setSS1__(refS1__.current?.getBoundingClientRect())
		}
	}, [])
	return (
		<div>
			<Stack>
				<Group h={200} gap={5}>
					<div style={wrapS} ref={refSS_}>
						<div style={ss} ref={refSS}>
							Text 1
						</div>
					</div>
					<div style={wrapS} ref={refS1_}>
						<div style={s1} ref={refS1}>
							<div ref={refS1__}>Text wewe we wref w efwef2</div>
						</div>
					</div>
				</Group>
				<Stack p={20}>
					<div>ss</div>
					<Code>sss: {JSON.stringify(sss)}</Code>
					<Code>wss: {JSON.stringify(sss_)}</Code>
					<div>s1</div>
					<Code>ss1: {JSON.stringify(ss1)}</Code>
					<Code>ws1: {JSON.stringify(ss1_)}</Code>
					<Code>is1: {JSON.stringify(ss1__)}</Code>
				</Stack>
			</Stack>
		</div>
	)
}

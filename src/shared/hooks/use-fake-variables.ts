import { FAKE_VARIBLES } from '../constants'
const parseVarible = (varible: string) => {
	return varible.replace(/^{/g, '').replace(/}$/, '')
}

const checkVarible = (varible: string) => {
	varible = varible.trim()
	return /^{/.test(varible) && /}$/.test(varible)
}

const getFake = (varible: string) => {
	varible = parseVarible(varible)
	return FAKE_VARIBLES[varible] ?? varible
}

export function useFakeVariables() {
	return {
		FAKE_VARIBLES,
		checkVarible,
		parseVarible,
		getFake,
	}
}

import { ROUND } from '../constants'

export function round(value: number): number {
	return Math.ceil(value * ROUND) / ROUND
}

export function roundInt(value: number): number {
	return Math.ceil(value)
}

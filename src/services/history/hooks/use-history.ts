import { storeApp } from '../../../entites/app/store'
import { storeHistory } from '../../../entites/history/store'
import { debounce } from '../../../shared/utils'

export function useHistory(time: number = 500) {
	function append(objects: any[], label = '', props: Record<string, any> = {}) {
		while (storeHistory.histories.length > storeApp.historyCount - 1) {
			storeHistory.histories.pop()
		}
		storeHistory.append(objects, label, props)
	}
	return {
		appendDebounce: debounce((objects: any[], label = '', props: Record<string, any> = {}) => {
			append(objects, label, props)
		}, time),
		append: (objects: any[], label = '', props: Record<string, any> = {}) => {
			append(objects, label, props)
		},
		clear: storeHistory.clear,
	}
}

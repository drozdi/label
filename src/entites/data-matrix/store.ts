import { makeAutoObservable } from 'mobx'
import { requestDataMatrixList } from './api'

class StoreDataMatrix {
	list = [
		{
			id: 1,
			name: 'Молочная продукция',
			length: 42,
			dm: '0104603721020607215>(egerf3ukLfdK5r93zoJf',
		},
		{
			id: 2,
			name: 'Упакованная вода',
			length: 38,
			dm: '0104603721020607215>(egukLfdK5r93zoJf',
		},
		{
			id: 3,
			name: 'Бады длинный код',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 4,
			name: 'Бады укороченный код',
			length: 38,
			dm: '0104603721020607215>(egukLfdK5r93zoJf',
		},
		{
			id: 5,
			name: 'Обувь',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 6,
			name: 'Табак',
			length: 29,
			dm: '0104603721020607215>5r93zoJf',
		},
		{
			id: 7,
			name: 'Духи и туалетная вода',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 8,
			name: 'Шины и покрышки',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 9,
			name: 'Фармацевтическая продукция',
			length: 31,
			dm: '0104603721020607215>(K5r93zoJf',
		},
		{
			id: 10,
			name: 'Велосипеды',
			length: 31,
			dm: '0104603721020607215>(K5r93zoJf',
		},
		{
			id: 11,
			name: 'Кресла-коляски',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 12,
			name: 'Альтернативная табачная продукция',
			length: 29,
			dm: '0104603721020607215>5r93zoJf',
		},
		{
			id: 13,
			name: 'Пиво',
			length: 43,
			dm: '0104603721020607215>(egerf3ukLfdbK5r93zoJf',
		},
		{
			id: 14,
			name: 'Никотинсодержащая продукция',
			length: 29,
			dm: '0104603721020607215>5r93zoJf',
		},
		{
			id: 15,
			name: 'Антисептик длинный код',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 16,
			name: 'Антисептик укороченный код',
			length: 38,
			dm: '0104603721020607215>(egukLfdK5r93zoJf',
		},
		{
			id: 17,
			name: 'Икра осетровых и лососевых рыб длинный код',
			length: 78,
			dm: '0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 18,
			name: 'Икра осетровых и лососевых рыб укороченный код',
			length: 31,
			dm: '0104603721020607215>(egukLfdK5r93zoJf',
		},
		{
			id: 19,
			name: 'Слабоалкогольные напитки',
			length: 32,
			dm: '0104603721020607215>(K5fr93zoJf',
		},
		{
			id: 20,
			name: 'Безалкогольные напитки',
			length: 38,
			dm: '0104603721020607215>(egukLfdK5r93zoJf',
		},
		{
			id: 21,
			name: 'Растительное масло',
			length: 38,
			dm: '0104603721020607215>(e5r93zoJf',
		},
		{
			id: 22,
			name: 'Косметика и бытовая химия длинный код',
			length: 78,
			dm: '0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 23,
			name: 'Косметика и бытовая химия укороченный код',
			length: 31,
			dm: '0104603721020607215>(egr93zoJf',
		},
		{
			id: 24,
			name: 'Консервы из овощей и фруктов длинный код',
			length: 78,
			dm: '0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 25,
			name: 'Консервы из овощей и фруктов укороченный код',
			length: 31,
			dm: '0104603721020607215>fdKr93zoJf',
		},
		{
			id: 26,
			name: 'Корма для животных длинный код',
			length: 78,
			dm: '0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 27,
			name: 'Корма для животных укороченный код',
			length: 31,
			dm: '0104603721020607215>(e7L93zoJf',
		},
		{
			id: 28,
			name: 'Ветеринарные препараты',
			length: 85,
			dm: '0104603721020607215>(eguk(e3fwgukLfdK5rLfdK(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
		{
			id: 29,
			name: 'Игрушки',
			length: 78,
			dm: '0104603721020607215>(eguk(e3frLfdf4K(egukLfdK5r(egukLfdK5r(egukLfdK5r5r93zoJf',
		},
	]
	constructor() {
		makeAutoObservable(this)
	}
	_sizes = []
	isLoaded = false
	isLoading = false
	error = ''

	get sizes() {
		this.load()
		return this._sizes
	}
	async load(reloading: boolean = false) {
		if (reloading) {
			this.isLoaded = false
			this._sizes = []
		}
		if (this.isLoaded) {
			return
		}
		this.isLoading = true
		this.error = ''
		try {
			const res = await requestDataMatrixList()
			this._sizes = res
			this.isLoaded = true
		} catch (e) {
			this.error = e.message || e.toString() || 'Unknown error'
		} finally {
			this.isLoading = false
		}
	}
	async selectedDM(dm) {
		await this.load()
		const dm_element = {
			dm: dm.dm,
			length: dm.length,
		}
		for (let i = 0; i < this._sizes.length; i++) {
			if (this._sizes[i].max_data_alpha_num >= dm_element.length) {
				dm_element.size = this._sizes[i].row_sym_size
				break
			}
		}
		return dm_element
	}
}

export const storeDataMatrix = new StoreDataMatrix()

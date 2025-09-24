interface IDataMatrix {
	id?: number
	name?: string
	length?: number
	dm?: string
	row_sym_size?: number
	col_sym_size?: number
	map_one_matr_size?: number
	map_matr_size?: number
	total_codewords?: number
	max_data_num?: number
	max_data_alpha_num?: number
}

interface IRequestDataMatrix {}

interface IResponseDataMatrixList {
	success: boolean
	data: IDataMatrix[]
}

interface IStoreDataMatrix {
	list: IDataMatrix[]
	_sizes: IDataMatrix[]
	isLoaded: boolean
	isLoading: boolean
	error: string
	fakeBodyDM: string
	sizes: IDataMatrix[]
	load(reloading: boolean): Promise<void>
	selectedDM(dm: IDataMatrix): Promise<IDataMatrix>
	_selectedDM(dm: IDataMatrix): IDataMatrix
	findById(dm: number): IDataMatrix | undefined
	findByDM(dm: string): IDataMatrix | undefined
	findByName(dm: string): IDataMatrix | undefined
}

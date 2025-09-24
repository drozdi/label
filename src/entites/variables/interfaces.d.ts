interface IVariable {
	data: string
	name: string
}

interface IRequestVariable {}

type IResponseVariableList = IRequestVariable[]

interface IStoreVariables {
	isLoading: boolean
	isLoaded: boolean
	error: string
	_list: IVariable[]
	list: IVariable[]
	load(reloading: boolean): Promise<void>
}

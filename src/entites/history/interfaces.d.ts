interface IHistory {
	objects: any
	label: string
	time: t
	props: Record<string, any>
	id: number
}

interface IStoreHistory {
	histories: IHistory[]
	curIndex: number
	fn?: Function
	length: number
	canGoBack: boolean
	canGoForward: boolean
	current: IHistory | undefined
	clear(): void
	fundById(id: number): IHistory | undefined
	back(): void
	forward(): void
	goTo(index: number): void
	append(objects: any[], label: string, props: Record<string, any>): void
}

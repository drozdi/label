interface IAppContext {
	fontFamilyFlag?: boolean
	variableFlag?: boolean
	imageFlag?: boolean
	loadTemplateFlag?: boolean
	settingsFlag?: boolean
	dataMatrixFlag?: boolean
	importFlag?: boolean
	gridFlag?: boolean
	previewFlag?: boolean
	jsonCodeFlag?: boolean
	errorName?: boolean
	showAppLoader?: boolean

	setFontFamilyFlag?: (flag: boolean) => void
	setVariableFlag?: (flag: boolean) => void
	setImageFlag?: (flag: boolean) => void
	setLoadTemplateFlag?: (flag: boolean) => void
	setSettingsFlag?: (flag: boolean) => void
	setDataMatrixFlag?: (flag: boolean) => void
	setImportFlag?: (flag: boolean) => void
	setGridFlag?: (flag: boolean) => void
	setPreviewFlag?: (flag: boolean) => void
	setJsonCodeFlag?: (flag: boolean) => void
	setErrorName?: (flag: boolean) => void
	setShowAppLoader?: (flag: boolean) => void

	imageBg?: string
	setImageBg?: (bg: string) => void
	serverError?: boolean
	setServerError?: (flag: boolean) => void
	silent: (fn: Function) => void
}

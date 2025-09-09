interface AppContext {
	fontFamilyFlag?: boolean
	variableFlag?: boolean
	imageFlag?: boolean
	loadTemplateFlag?: boolean
	settingsFlag?: boolean
	dataMatrixFlag?: boolean
	importFlag?: boolean
	gridFlag?: boolean
	previewFlag?: boolean
	managerFontFamilyFlag?: boolean
	managerImagesFlag?: boolean

	setFontFamilyFlag?: (flag: boolean) => void
	setVariableFlag?: (flag: boolean) => void
	setImageFlag?: (flag: boolean) => void
	setLoadTemplateFlag?: (flag: boolean) => void
	setSettingsFlag?: (flag: boolean) => void
	setDataMatrixFlag?: (flag: boolean) => void
	setImportFlag?: (flag: boolean) => void
	setGridFlag?: (flag: boolean) => void
	setPreviewFlag?: (flag: boolean) => void
	setManagerFontFamilyFlag?: (flag: boolean) => void
	setManagerImagesFlag?: (flag: boolean) => void

	imageBg?: string
	setImageBg?: (bg?: string) => void
	serverError?: boolean
	setServerError?: (flag: boolean) => void
}

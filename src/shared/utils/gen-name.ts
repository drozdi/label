export function genName(name: string): string {
	let name_slice = name.toUpperCase()
	if (name.length > 6) {
		name_slice = name.slice(0, 6)
	}
	let key = ''
	const abc = 'QWERTYUIOPLKJHGFDSAZXCVBNM0123456789'
	let randomKey = abc[Math.floor(Math.random() * abc.length)]
	while (key.length < 2) {
		key += randomKey
		randomKey = abc[Math.floor(Math.random() * abc.length)]
	}
	return name_slice + key
}

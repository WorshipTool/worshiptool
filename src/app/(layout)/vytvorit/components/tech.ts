export const fixParserJsonString = (str: string) => {
	let res = str.replace(/'/g, '"')

	// False replace to false
	res = res.replace(/False/g, 'false')

	// True replace to true
	res = res.replace(/True/g, 'true')

	// Null replace to null
	res = res.replace(/Null/g, 'null')

	return res
}

export const getRandomString = (maxLength: number, minLenght: number = 1) => {
	const length =
		Math.floor(Math.random() * (maxLength - minLenght + 1)) + minLenght
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

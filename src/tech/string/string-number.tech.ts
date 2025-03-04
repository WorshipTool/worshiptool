export const generateNumberFromString = (
	str: string,
	min: number = 0,
	max: number = 100
): number => {
	// hex string to number, without parseInt
	// create hex from string
	let hex = 0
	for (let i = 0; i < str.length; i++) {
		hex = (hex << 5) - hex + str.charCodeAt(i)
		hex |= 0 // Convert to 32bit integer
	}

	// normalize to min and max
	// divide... not create only integer but float
	// for example for min 0 and max 1, create number between 0 and 1

	hex = (hex - min) / (max - min)

	return hex
}

export const getRandomInt = (min: number, max: number): number => {
	const range = max - min + 1
	return Math.floor(Math.random() * range) + min
}

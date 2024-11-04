export const czechConjugation = (
	one: string,
	two: string,
	five: string,
	count: number
) => {
	if (count === 1) return one
	if (count <= 4) return two
	return five
}

/**
 * Server side function to throw a forbidden error
 */
export const forbidden = () => {
	throw new Error('Forbidden')
}

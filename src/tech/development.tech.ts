export const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Just call this function, wherever you want to checkpoint your code.
 */
export const notImplemented = () => {
	throw new Error('Not implemented')
}

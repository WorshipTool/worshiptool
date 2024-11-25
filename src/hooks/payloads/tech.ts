// if string is an object, return it, otherwise parse it
export const getPayloadObjectFromApiString = <T extends object>(
	apiString: string,
	defaults?: T
): T => {
	const data = typeof apiString !== 'object' ? JSON.parse(apiString) : apiString
	const payload: T = {
		...defaults,
		...data,
	}

	return payload
}

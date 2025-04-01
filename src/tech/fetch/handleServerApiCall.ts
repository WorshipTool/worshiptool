import { AxiosResponse } from 'axios'

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleServerApiCall = async <T>(
	request: Promise<AxiosResponse<T>>
) => {
	try {
		const res = await request

		return res.data
	} catch (err) {
		throw err
	}
}

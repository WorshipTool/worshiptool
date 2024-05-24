import { AxiosResponse } from 'axios'

export const networkErrorEvent = 'networkErrorEvent'
export const unauthorizedEvent = 'unauthorizedEvent'

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleApiCall = <T>(request: Promise<AxiosResponse<T>>) => {
	return request
		.then((res) => {
			return res.data
		})
		.catch((err) => {
			if (typeof window === 'undefined') throw err

			if (err.message == 'Network Error') {
				window?.dispatchEvent(new CustomEvent(networkErrorEvent))
			} else if (err.response.status === 502) {
				window?.dispatchEvent(new CustomEvent(networkErrorEvent))
			}
			if (err.response.status === 401) {
				window?.dispatchEvent(new CustomEvent(unauthorizedEvent))
			}
			throw err
		})
}

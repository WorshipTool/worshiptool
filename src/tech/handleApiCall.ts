import { AxiosResponse } from 'axios'

export const networkErrorEvent = 'networkErrorEvent'
export const unauthorizedEvent = 'unauthorizedEvent'

export const norequiredPermissionEvent = 'norequiredPermissionEvent'

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleApiCall = <T>(
	request: Promise<AxiosResponse<T>>
): Promise<T> => {
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
			if (err.response.status) {
				switch (err.response.status) {
					case 401:
						window?.dispatchEvent(new CustomEvent(unauthorizedEvent))
						break
					case 403:
						window?.dispatchEvent(new CustomEvent(norequiredPermissionEvent))
						break
				}
			}
			throw err
		})
}

export const hac = handleApiCall

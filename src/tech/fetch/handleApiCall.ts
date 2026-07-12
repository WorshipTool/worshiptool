import * as Sentry from '@sentry/nextjs'
import { AxiosResponse } from 'axios'

export const networkErrorEvent = 'networkErrorEvent'
export const unauthorizedEvent = 'unauthorizedEvent'
export const norequiredPermissionEvent = 'norequiredPermissionEvent'
export const serviceUnavailableEvent = 'serviceUnavailableEvent'

export type HandleApiCallOptions = {
	ignoreUnauthorizedError?: boolean
}

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleApiCall = <T>(
	request: Promise<AxiosResponse<T>>,
	options: HandleApiCallOptions = {}
): Promise<T> => {
	return request
		.then((res) => {
			return res.data
		})
		.catch((err) => {
			if (typeof window === 'undefined') throw err

			const status: number | undefined = err?.response?.status
			const isNetworkError = err?.message === 'Network Error'

			if (isNetworkError || status === 502) {
				window?.dispatchEvent(new CustomEvent(networkErrorEvent))
			}
			switch (status) {
				case 401:
					if (options?.ignoreUnauthorizedError) break
					window?.dispatchEvent(new CustomEvent(unauthorizedEvent))
					break
				case 403:
					window?.dispatchEvent(new CustomEvent(norequiredPermissionEvent))
					break
				case 503:
					window?.dispatchEvent(new CustomEvent(serviceUnavailableEvent))
					break
			}

			// Server failures (5xx) are unexpected — report them.
			// Client errors (4xx) and offline network errors are not.
			if (status && status >= 500) {
				Sentry.captureException(err, {
					tags: { apiErrorStatus: String(status) },
					extra: {
						url: err?.config?.url,
						method: err?.config?.method,
					},
				})
			}

			throw err
		})
}

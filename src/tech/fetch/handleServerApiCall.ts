import { HandleApiCallOptions } from '@/tech/fetch/handleApiCall'
import * as Sentry from '@sentry/nextjs'
import { AxiosResponse } from 'axios'

// Handle function for all API calls
// parameters: request - asynchronous function that returns a promise
// Handles errors and returns the promise response
export const handleServerApiCall = async <T>(
	request: Promise<AxiosResponse<T>>,
	options: HandleApiCallOptions = {}
) => {
	try {
		const res = await request

		return res.data
	} catch (err: any) {
		const status: number | undefined = err?.response?.status

		// On the server, both 5xx responses and network failures
		// (backend unreachable) are unexpected — report them.
		if (!status || status >= 500) {
			Sentry.captureException(err, {
				tags: { apiErrorStatus: status ? String(status) : 'network' },
				extra: {
					url: err?.config?.url,
					method: err?.config?.method,
				},
			})
		}

		throw err
	}
}

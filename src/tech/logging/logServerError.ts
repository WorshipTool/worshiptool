'use server'

import { useServerApi } from '@/api/tech-and-hooks/useServerApi'
import * as Sentry from '@sentry/nextjs'

/**
 * This function works similarily to console.error, but it also reports
 * the error to Sentry and forwards it to the backend logger.
 */
export async function logServerError(title: string, description: string) {
	const { loggerApi } = await useServerApi()

	console.error(title + ':', description)

	Sentry.captureMessage(`${title}: ${description}`, 'error')

	try {
		await loggerApi.error({
			title: title,
			content: description,
		})
	} catch (e) {
		console.error('Error sending error to backend logger', e)
	}
}

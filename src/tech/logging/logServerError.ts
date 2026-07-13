'use server'

import * as Sentry from '@sentry/nextjs'

/**
 * This function works similarily to console.error, but it also reports
 * the error to Sentry.
 */
export async function logServerError(title: string, description: string) {
	console.error(title + ':', description)

	Sentry.captureMessage(`${title}: ${description}`, 'error')
}

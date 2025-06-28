'use server'

import { useServerApi } from '@/api/tech-and-hooks/useServerApi'

/**
 * This function works similarily to console.error, but it can also send errors to messenger
 */
export async function logServerError(title: string, description: string) {
	const { messengerApi } = await useServerApi()

	console.error(title + ':', description)

	try {
		messengerApi.messengerControllerSendError({
			title: title,
			description: description,
		})
	} catch (e) {
		console.log('Error sending error to messenger', e)
	}
}

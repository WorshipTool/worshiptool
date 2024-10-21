import { BACKEND_URL } from './constants'

export function getUrl(relativeUrl: string) {
	const generatedURL = BACKEND_URL + relativeUrl
	return generatedURL
}

export const getAbsoluteUrl = (relativeUrl: string) => {
	const frontendUrl = window.location.origin
	return `${frontendUrl}${relativeUrl}`
}

export const getImageUrl = (imageGuid: string) => {
	if (!imageGuid) return null
	return BACKEND_URL + '/images/' + imageGuid
}

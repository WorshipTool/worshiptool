import { BACKEND_URL } from './constants'

export function getUrl(relativeUrl: string) {
	const generatedURL = BACKEND_URL + relativeUrl
	return generatedURL
}

export const getAbsoluteUrl = (relativeUrl: string) => {
	const frontendUrl = window.location.origin
	return `${frontendUrl}${relativeUrl}`
}

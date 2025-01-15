import { normalizeCzechString } from '@/tech/string/string.tech'

export default function normalizeSearchText(input: string): string {
	const englishNormalize = normalizeCzechString(input)
	const onlyLegitChars = englishNormalize.replace(/[^A-Za-z0-9]/gi, '')

	let result = onlyLegitChars.toLowerCase()
	result = result.replaceAll('mne', 'me')
	result = result.replaceAll('y', 'i')

	// Remove multiple letters in row
	result = result.replace(/(.)\1+/g, '$1')

	return result
}

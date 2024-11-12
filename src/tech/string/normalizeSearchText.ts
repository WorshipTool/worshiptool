import { normalizeCzechString } from '@/tech/string/string.tech'

export default function normalizeSearchText(input: string): string {
	const englishNormalize = normalizeCzechString(input)
	const onlyLegitChars = englishNormalize.replace(/[^A-Za-z0-9]/gi, '')

	let result = onlyLegitChars.toLowerCase()
	result = result.replaceAll('mne', 'me')
	result = result.replaceAll('y', 'i')

	return result
}

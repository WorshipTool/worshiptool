import { normalizeCzechString } from '@/tech/string/string.tech'

export default function normalizeSearchText(input: string): string {
	const onlyLegitChars = input.replace(
		/[^A-Za-z0-9ěščřžýáíéúůťďňĚŠČŘŽÝÁÍÉÚŮŤĎŇ]/gi,
		''
	)

	const englishNormalize = normalizeCzechString(onlyLegitChars)

	let result = englishNormalize.toLowerCase()
	result = result.replaceAll('mne', 'me')
	result = result.replaceAll('y', 'i')

	return result
}

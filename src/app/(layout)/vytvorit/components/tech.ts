import json5 from 'json5'

export const fixParserJsonString = (str: string) => {
	const fixedStr = str
		.replace(/\bFalse\b/g, 'false')
		.replace(/\bTrue\b/g, 'true')
	const s = json5.parse(fixedStr)
	return JSON.stringify(s)
}

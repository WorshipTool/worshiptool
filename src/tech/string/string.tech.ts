export const czechConjugation = (
	one: string,
	two: string,
	five: string,
	count: number
) => {
	if (count === 0) return five
	if (count <= 1) return one
	if (count <= 4) return two
	return five
}

export const normalizeCzechString = (text: string) => {
	const mapovani = {
		á: 'a',
		č: 'c',
		ď: 'd',
		é: 'e',
		ě: 'e',
		í: 'i',
		ň: 'n',
		ó: 'o',
		ř: 'r',
		š: 's',
		ť: 't',
		ú: 'u',
		ů: 'u',
		ý: 'y',
		ž: 'z',
		Á: 'A',
		Č: 'C',
		Ď: 'D',
		É: 'E',
		Ě: 'E',
		Í: 'I',
		Ň: 'N',
		Ó: 'O',
		Ř: 'R',
		Š: 'S',
		Ť: 'T',
		Ú: 'U',
		Ů: 'U',
		Ý: 'Y',
		Ž: 'Z',
		// Additional characters
		ô: 'o',
		Ô: 'O',
		ľ: 'l',
		Ľ: 'L',
		ĺ: 'l',
		Ĺ: 'L',
		ä: 'a',
		Ä: 'A',
		ö: 'o',
		Ö: 'O',
		ü: 'u',
		Ü: 'U',
		ß: 'ss',
		ñ: 'n',
		Ñ: 'N',
		å: 'a',
		Å: 'A',
		æ: 'ae',
		Æ: 'AE',
		ø: 'o',
		Ø: 'O',
	}

	for (var znak in mapovani) {
		var regex = new RegExp(znak, 'g')
		text = text.replace(regex, mapovani[znak as keyof typeof mapovani])
	}

	return text
}

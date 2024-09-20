export const JOIN_TEAM_CODE_KEY = 'af486af-3a'

function caesarCipherWithShift(text: string, shift: number) {
	return text
		.split('')
		.map((char) => {
			// Pouze písmena budeme posouvat
			if (char.match(/[a-zA-Z]/)) {
				const charCode = char.charCodeAt(0)
				let base = charCode >= 65 && charCode <= 90 ? 65 : 97 // Rozlišení velkých a malých písmen
				return String.fromCharCode(
					((((charCode - base + shift) % 26) + 26) % 26) + base
				)
			}
			return char // Pokud to není písmeno, nechat beze změny
		})
		.join('')
}

export const encodeTeamCode = (teamCode: string) => {
	const LOOP_COUNT = 3

	let result = ''

	for (let i = 0; i < LOOP_COUNT; i++) {
		result += caesarCipherWithShift(teamCode, teamCode.length - i)
	}
	return result
}

export const decodeTeamCode = (teamCode: string) => {
	// split code to 3 parts
	const len = teamCode.length / 3
	const coded = teamCode.slice(0, len)

	const encode = caesarCipherWithShift(coded, -len)
	return encode
}

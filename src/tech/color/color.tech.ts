export function stringToColor(string: string) {
	let hash = 0
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash)
	}

	// Použijeme HSL hodnoty pro modernější barvy
	const hue = hash % 360 // Rozsah 0-360 pro odstín
	const saturation = 55 + (hash % 30) // Rozsah 65-85% pro sytost
	const lightness = 50 + (hash % 20) // Rozsah 60-70% pro jas

	return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

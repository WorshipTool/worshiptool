const unsecuredCopyToClipboard = (text: string) => {
	const textArea = document.createElement('textarea')
	textArea.value = text
	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()
	try {
		const d = document.execCommand('copy')
		if (!d) return console.error('Unable to copy to clipboard (in)')
	} catch (err) {
		console.error('Unable to copy to clipboard', err)
	}
	document.body.removeChild(textArea)
}

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
export const copyToClipboard = (content: string) => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(content)
	} else {
		unsecuredCopyToClipboard(content)
	}
}

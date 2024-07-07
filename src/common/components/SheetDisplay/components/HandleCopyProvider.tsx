'use client'

type SheetDisplayProps = {
	children: React.ReactNode
}

export default function HandleCopyProvider(props: SheetDisplayProps) {
	const handleCopy = (e: React.ClipboardEvent<HTMLDivElement>) => {
		e.preventDefault()
		const input = window.getSelection()?.toString() || ''

		const text = input.replace(/\s+/g, ' ')

		e.clipboardData.setData('text/plain', text)
	}
	return <div onCopy={handleCopy}>{props.children}</div>
}

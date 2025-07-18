interface GapProps {
	value?: number
	horizontal?: boolean
}

export function Gap({ value, horizontal }: GapProps) {
	return (
		<div
			style={{
				height: !horizontal ? (value ? value * 10 : 10) : 0,
				width: horizontal ? (value ? value * 10 : 10) : 0,
			}}
		></div>
	)
}

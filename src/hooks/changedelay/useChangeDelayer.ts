import { useEffect, useRef } from 'react'

export const useChangeDelayer = <T>(
	value: T,
	onChange: (value: T) => void,
	delay: number = 300
) => {
	const loadTimeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	)
	useEffect(() => {
		clearTimeout(loadTimeoutId.current)
		const INTERVAL = delay

		loadTimeoutId.current = setTimeout(() => {
			onChange(value)
		}, INTERVAL)

		return () => clearTimeout(loadTimeoutId.current)
	}, [value, delay, onChange])
}

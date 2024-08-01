import { useEffect, useRef } from 'react'

/**
 * This hook is used to delay the onChange function call when the value changes.
 * @param value The value that is being changed
 * @param onChange The function that is called when the value changes
 * @param delay The delay of change in milliseconds
 * @param dependencies Props on which onChange function depends
 */
export const useChangeDelayer = <T>(
	value: T,
	onChange: (value: T) => void,
	dependencies: any[],
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
	}, [value, delay, ...dependencies])
}

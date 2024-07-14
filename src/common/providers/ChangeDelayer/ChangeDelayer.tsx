'use client'

import { useEffect, useRef } from 'react'

interface ChangeDelayerProps<T> {
	value: T
	onChange: (value: T) => void
	delay?: number
}

export default function OnChangeDelayer<T>({
	value,
	onChange,
	delay = 300,
}: ChangeDelayerProps<T>) {
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
	}, [value])
	return <></>
}

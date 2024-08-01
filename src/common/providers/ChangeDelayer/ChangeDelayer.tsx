'use client'

import { useEffect, useRef } from 'react'

interface ChangeDelayerProps {
	value: any
	onChange: (value: any) => void
	delay?: number
}

export default function OnChangeDelayer({
	value,
	onChange,
	delay = 300,
}: ChangeDelayerProps) {
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

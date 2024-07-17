'use client'

import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'

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
	useChangeDelayer(value, onChange, delay)
	return <></>
}

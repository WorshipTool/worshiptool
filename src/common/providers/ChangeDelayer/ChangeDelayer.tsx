'use client'

import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { memo } from 'react'

interface ChangeDelayerProps<T> {
	value: T
	onChange: (value: T) => void
	delay?: number
}

export const OnChangeDelayer = memo(function OnChangeDelayer<T>({
	value,
	onChange,
	delay = 300,
}: ChangeDelayerProps<T>) {
	useChangeDelayer(value, onChange, delay)
	return <></>
})

export default OnChangeDelayer

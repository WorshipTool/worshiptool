import { RoutesKeys, SmartSearchParams } from '@/routes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type UseURLStateOptions = {}

export function useUrlState<T = string>(
	key: string,
	startValue?: T,
	options?: UseURLStateOptions
) {
	const [value, _setValue] = useState<T | null>(() => {
		if (typeof window === 'undefined') return startValue || null
		const params = new URLSearchParams(window.location.search)
		return (params.get(key) || startValue || null) as T | null
	})

	const setValue = (value: T | null) => {
		_setValue(value)

		const params = new URLSearchParams(window.location.search)
		if (value === null) {
			params.delete(key)
		} else {
			params.set(key, value as string)
		}

		const url = `${window.location.pathname}?${params.toString()}`

		window.history.replaceState({}, '', url)
	}

	const [first, setFirst] = useState(true)
	const params = useSearchParams()
	useEffect(() => {
		if (first) return
		const _value = params.get(key)
		if (_value !== value) _setValue(_value || first ? startValue || null : null)
		setFirst(false)
	}, [params])

	return [value, setValue] as const
}

export const useSmartUrlState = <T extends RoutesKeys>(
	page: T,
	paramKey: keyof SmartSearchParams<T>,
	options?: UseURLStateOptions
) =>
	useUrlState<SmartSearchParams<T>[typeof paramKey]>(
		paramKey as string,
		undefined,
		options
	)

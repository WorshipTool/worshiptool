import { RoutesKeys, SmartSearchParams } from '@/routes'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type UseURLStateOptionsRequired<T> = {
	parse: (value: string) => T
	stringify: (value: T) => string
}

type UseUrlStateProps<T = string> =
	| [key: string, startValue?: string]
	| [key: string, startValue: T, options: UseURLStateOptionsRequired<T>]

export function useUrlState<T = string>(...props: UseUrlStateProps<T>) {
	const [key] = props
	const startValue = props[1] as T | undefined

	const { parse, stringify } = (props[2] as UseURLStateOptionsRequired<T>) || {
		parse: (value: string) => value as T,
		stringify: (value: T) => value as unknown as string,
	}

	const [value, _setValue] = useState<T | null>(() => {
		if (typeof window === 'undefined') return startValue || null
		const params = new URLSearchParams(window.location.search)
		const v = params.get(key)
		const vv = v ? parse(v) : null
		return vv || startValue || null
	})

	const setValue = (value: T | null) => {
		_setValue(value)

		const params = new URLSearchParams(window.location.search)
		if (value === null) {
			params.delete(key)
		} else {
			const strValue = stringify(value)
			params.set(key, strValue)
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
	paramKey: keyof SmartSearchParams<T>
) => useUrlState(paramKey as string, undefined)

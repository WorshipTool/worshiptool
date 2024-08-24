import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export const useUrlState = (key: string) => {
	const [value, _setValue] = useState<string | null>(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get(key)
	})

	const setValue = (value: string | null) => {
		_setValue(value)

		const params = new URLSearchParams(window.location.search)
		if (value === null) {
			params.delete(key)
		} else {
			params.set(key, value)
		}

		const url = `${window.location.pathname}?${params.toString()}`

		window.history.replaceState({}, '', url)
	}

	const params = useSearchParams()
	useEffect(() => {
		const _value = params.get(key)
		if (_value !== value) _setValue(_value)
	}, [params])

	return [value, setValue] as const
}

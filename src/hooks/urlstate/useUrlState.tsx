import { useState } from 'react'

export const useUrlState = (key: string) => {
	const [value, _setValue] = useState<string | null>(() => {
		const params = new URLSearchParams(window.location.search)
		return params.get(key)
	})

	const setValue = (value: string) => {
		_setValue(value)

		const params = new URLSearchParams(window.location.search)
		params.set(key, value)

		const url = `${window.location.pathname}?${params.toString()}`

		window.history.replaceState({}, '', url)
	}

	return [value, setValue] as const
}

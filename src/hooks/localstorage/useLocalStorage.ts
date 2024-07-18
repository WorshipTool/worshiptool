import { useState } from 'react'

/**
 * This hook holds current value in local storage.
 * Loads the value on beginning and saves it on change.
 * @param key
 * @returns
 */
export const useLocalStorage = <T = string>(key: string) => {
	const get = (): T | undefined => {
		if (typeof localStorage === 'undefined') return undefined
		const raw = localStorage?.getItem(key)
		if (!raw) return undefined
		return JSON.parse(raw)
	}

	// Hook holds the current value
	const [value, setValue] = useState<T | undefined>(get)

	/**
	 * Set the value in local storage. If value is undefined, the key will be removed.
	 * @param value your value or undefined
	 */
	const set = (value: T | undefined) => {
		if (value === undefined) {
			remove()
			return
		}

		const stringValue = JSON.stringify(value)
		localStorage?.setItem(key, stringValue)

		setValue(value)
	}

	const remove = () => {
		localStorage?.removeItem(key)
	}

	return {
		value,
		set,
		remove,
	}
}

import { useCallback, useEffect, useState } from 'react'

type InitialValueType<T> = T | ((prev?: T) => T)

type ReturnValueType<T> = {
	state: T
	setState: (value: InitialValueType<T>) => void
	undo: () => void
	redo: () => void
	hasUndo: boolean
	hasRedo: boolean
	reset: () => void
}

type HistoryPair<T> = {
	value: InitialValueType<T>
	timestamp: number
}

/**
 * This hook works like useState, but also holds a history of the values.
 * It allows you to undo and redo the changes.
 * Function 'reset' is able to clear the history.
 */
export const useStateWithHistory: <T>(
	initialValue: InitialValueType<T>
) => ReturnValueType<T> = <T>(initialValue: InitialValueType<T>) => {
	const [state, _setState] = useState<T>(initialValue)
	const [history, setHistory] = useState<HistoryPair<T>[]>(
		initialValue !== undefined && initialValue !== null
			? [
					{
						value: initialValue,
						timestamp: Date.now(),
					},
			  ]
			: []
	)
	const [pointer, setPointer] = useState<number>(
		initialValue !== undefined && initialValue !== null ? 0 : -1
	)

	/**
	 * This function is used to set the state.
	 */
	const setState: (value: InitialValueType<T>) => void = useCallback(
		(value: InitialValueType<T>) => {
			let valueToAdd = value
			if (typeof value === 'function') {
				valueToAdd = (value as (prev?: T) => T)(state)
			}

			// Check if previous value is time distance is less than 300ms
			// If so, remove the last value from history
			const TIME_DISTANCE = 300
			const removePrevValue =
				history[pointer] &&
				Date.now() - history[pointer].timestamp < TIME_DISTANCE

			const newItem = {
				value: valueToAdd,
				timestamp: Date.now(),
			}

			setHistory((prev) => [
				...prev.slice(0, pointer + (removePrevValue ? 0 : 1)),
				newItem,
			])
			setPointer((prev) => prev + (removePrevValue ? 0 : 1))
			_setState(value)
		},
		[setHistory, setPointer, _setState, state, pointer, history]
	)

	/**
	 * This function is used to undo the last change
	 */
	const undo: () => void = useCallback(() => {
		if (pointer <= 0) return
		_setState(history[pointer - 1].value)
		setPointer((prev) => prev - 1)
	}, [history, pointer, setPointer])

	/**
	 * This function is used to redo the last change
	 *
	 */
	const redo: () => void = useCallback(() => {
		if (pointer + 1 >= history.length) return
		_setState(history[pointer + 1].value)
		setPointer((prev) => prev + 1)
	}, [pointer, history, setPointer])

	/**
	 * This function clear the history and set last value as current
	 */
	const reset = useCallback(() => {
		setHistory((prev) => [prev.at(-1)!])
		setPointer(0)
	}, [setHistory, setPointer])

	useEffect(() => {
		// Add CTRL+Z and CTRL+Y support for undo and redo
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'z':
					if (event.ctrlKey || event.metaKey) {
						event.preventDefault()
						undo()
					}
					break
				case 'y':
					if (event.ctrlKey || event.metaKey) {
						if (event.shiftKey) {
							event.preventDefault()
							undo()
						} else {
							event.preventDefault()
							redo()
						}
					}
					break
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [redo, undo])

	return {
		state,
		setState,
		undo,
		redo,
		hasUndo: pointer > 0,
		hasRedo: pointer + 1 < history.length,
		reset,
	}
}

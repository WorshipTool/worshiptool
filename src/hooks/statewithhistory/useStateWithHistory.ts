import { useCallback, useState } from 'react'

type InitialValueType<T> = T | ((prev?: T) => T)

//the return value type it's an array with an element
//of type T, a setter for the element, two functions (undo and redo)
//the array of history and the current value
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

	const setState: (value: InitialValueType<T>) => void = useCallback(
		(value: InitialValueType<T>) => {
			let valueToAdd = value
			if (typeof value === 'function') {
				valueToAdd = (value as (prev?: T) => T)(state)
			}

			// Check if previous value is time distance is less than 300ms
			// If so, remove the last value from history
			const removePrevValue =
				history[pointer] && Date.now() - history[pointer].timestamp < 300

			setHistory((prev) => [
				...prev.slice(0, pointer + (removePrevValue ? 0 : 1)),
				{
					value: valueToAdd,
					timestamp: Date.now(),
				},
			])
			setPointer((prev) => prev + (removePrevValue ? 0 : 1))
			_setState(value)
		},
		[setHistory, setPointer, _setState, state, pointer]
	)

	const undo: () => void = useCallback(() => {
		if (pointer <= 0) return
		_setState(history[pointer - 1].value)
		setPointer((prev) => prev - 1)
	}, [history, pointer, setPointer])

	const redo: () => void = useCallback(() => {
		if (pointer + 1 >= history.length) return
		_setState(history[pointer + 1].value)
		setPointer((prev) => prev + 1)
	}, [pointer, history, setPointer])

	// set last as only value in history
	const reset = useCallback(() => {
		setHistory([
			{
				value: state,
				timestamp: Date.now(),
			},
		])
		setPointer(0)
	}, [state, setHistory, setPointer])

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

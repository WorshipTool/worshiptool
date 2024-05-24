'use client'
import { DependencyList, useEffect } from 'react'
import { ApiState, isApiStateDispatched } from './ApiState'
import { useApiState } from './useApiState'

type UseApiStateProps<T> = Parameters<typeof useApiState<T>>

export const useApiStateEffect = <T>(
	dispatch: () => Promise<T>,
	deps?: DependencyList,
	...props: UseApiStateProps<T>
): [ApiState<T>, () => void] => {
	const { fetchApiState, apiState, invalidateApiState } = useApiState<T>(
		...props
	)

	useEffect(() => {
		if (!isApiStateDispatched(apiState)) {
			fetchApiState(dispatch)
		}
	}, [apiState])

	useEffect(() => {
		if (isApiStateDispatched(apiState)) {
			invalidateApiState() //TODO: FIXME - this is also called on unmount
		}
	}, deps || [])

	return [apiState, invalidateApiState]
}

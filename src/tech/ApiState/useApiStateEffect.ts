'use client'
import { DependencyList, useEffect, useRef } from 'react'
import { ApiState, isApiStateDispatched } from './ApiState'
import { useApiState } from './useApiState'

type UseApiStateProps<T> = Parameters<typeof useApiState<T>>

export const useApiStateEffect = <T>(
	dispatch: () => Promise<T>,
	deps: DependencyList = [],
	...props: UseApiStateProps<T>
): [ApiState<T>, () => void] => {
	const { fetchApiState, apiState, invalidateApiState } = useApiState<T>(
		...props
	)

	const isMounted = useRef(true)

	useEffect(() => {
		isMounted.current = true

		if (!isApiStateDispatched(apiState)) {
			fetchApiState(dispatch)
		}

		return () => {
			isMounted.current = false
		}
	}, [apiState])

	useEffect(() => {
		if (isMounted.current && isApiStateDispatched(apiState)) {
			invalidateApiState()
		}
	}, deps)

	return [apiState, invalidateApiState]
}

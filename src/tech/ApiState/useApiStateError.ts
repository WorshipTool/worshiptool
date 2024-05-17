'use client'
import { useEffect, useRef } from 'react'
import { ApiState } from './ApiState'

export const useApiStateError = (
	callback: () => void,
	deps: ApiState<unknown>[]
) => {
	const previousIsAnyLoading = useRef(false)

	useEffect(() => {
		if (previousIsAnyLoading.current) {
			if (deps.every((apiState) => apiState.error)) {
				callback()
			}
		}

		previousIsAnyLoading.current = deps.some((apiState) => apiState.loading)
	}, deps)
}

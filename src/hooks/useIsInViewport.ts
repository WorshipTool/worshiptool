'use client'
import { useEffect, useRef } from 'react'

export function useIsInViewport(
	ref: any,
	rootMargin = '0px',
	callback?: (intersecting: boolean) => void
) {
	const isIntersecting = useRef(false)
	const lastValue = useRef(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				isIntersecting.current = entry.isIntersecting
				if (callback && lastValue.current !== isIntersecting.current) {
					lastValue.current = isIntersecting.current
					callback(isIntersecting.current)
				}
			},
			{
				rootMargin,
			}
		)
		if (ref.current) {
			observer.observe(ref.current)
		}
		return () => {
			if (ref.current) observer.unobserve(ref.current)
		}
	}, [ref, callback, rootMargin])
}

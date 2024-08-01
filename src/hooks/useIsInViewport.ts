'use client'
import { useEffect, useRef, useState } from 'react'

export function useIsInViewport(
	ref: any,
	rootMargin = '0px',
	callback?: (intersecting: boolean) => void
) {
	const [isIntersecting, setIntersecting] = useState(false)
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIntersecting(entry.isIntersecting)
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
	}, [ref])

	const lastValue = useRef(isIntersecting)
	useEffect(() => {
		if (callback) {
			if (lastValue.current !== isIntersecting) {
				lastValue.current = isIntersecting
			} else {
				return
			}
			callback(isIntersecting)
		}
	}, [isIntersecting, callback])

	return isIntersecting
}

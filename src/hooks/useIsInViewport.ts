'use client'
import { useEffect, useState } from 'react'

export function useIsInViewport(ref: any, rootMargin = '0px') {
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

	return isIntersecting
}

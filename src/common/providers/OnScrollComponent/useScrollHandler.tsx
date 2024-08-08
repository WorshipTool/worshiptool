import { useEffect, useMemo, useState } from 'react'

type HandlerProps = {
	onChange?: (top: boolean, y: number) => void
	topThreshold?: number
}

export const useScrollHandler = (props?: HandlerProps) => {
	const [isTop, setIsTop] = useState(true)
	const [scroll, setScroll] = useState(0)

	const threshold = useMemo(
		() => props?.topThreshold || 10,
		[props?.topThreshold]
	)

	useEffect(() => {
		const handleScroll = (event: any) => {
			const isTop = window.scrollY < threshold
			setIsTop(isTop)
			setScroll(window.scrollY)

			if (props?.onChange) {
				props?.onChange(isTop, window.scrollY)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return { isTop, scroll: scrollY }
}

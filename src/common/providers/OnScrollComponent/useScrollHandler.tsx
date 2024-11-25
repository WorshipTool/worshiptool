import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useMemo, useState } from 'react'

type HandlerProps = {
	onChange?: (top: boolean, y: number) => void
	topThreshold?: number
}

export const useScrollHandler = (props?: HandlerProps) => {
	const [isTop, setIsTop] = useState(true)
	// const [scrollY, setScroll] = useState(0)

	const threshold = useMemo(
		() => props?.topThreshold || 10,
		[props?.topThreshold]
	)
	const { scrollY: y } = useScroll()
	useMotionValueEvent(y, 'change', (latest) => {
		const newIsTop = latest < threshold
		if (isTop !== newIsTop) {
			setIsTop(newIsTop)
		}
		// setScroll(latest)
	})

	return { isTop }
}

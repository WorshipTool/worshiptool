'use client'

import React, { useEffect } from 'react'

interface OnScrollComponentProps {
	component?: (top: boolean, y: number) => React.ReactElement
	onChange?: (top: boolean, y: number) => void
}

export default function OnScrollComponent({
	component,
	onChange,
}: OnScrollComponentProps) {
	const [isTop, setIsTop] = React.useState(true)
	const [scroll, setScroll] = React.useState(0)

	useEffect(() => {
		const handleScroll = (event: any) => {
			const isTop = window.scrollY < 10
			setIsTop(isTop)
			setScroll(window.scrollY)

			if (onChange) {
				onChange(isTop, window.scrollY)
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return <>{component ? component(isTop, scroll) : <></>}</>
}

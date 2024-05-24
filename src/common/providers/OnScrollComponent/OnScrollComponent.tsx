'use client'

import React, { useEffect } from 'react'

interface OnScrollComponentProps {
	component: (top: boolean, y: number) => React.ReactElement
}

export default function OnScrollComponent({
	component,
}: OnScrollComponentProps) {
	const [isTop, setIsTop] = React.useState(true)
	const [scroll, setScroll] = React.useState(0)

	useEffect(() => {
		const handleScroll = (event: any) => {
			setIsTop(window.scrollY < 10)
			setScroll(window.scrollY)
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	return <>{component(isTop, scroll)}</>
}

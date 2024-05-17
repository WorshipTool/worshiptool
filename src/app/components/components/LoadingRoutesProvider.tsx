'use client'
import React, { useEffect } from 'react'

type LoadingRoutesProviderProps = {
	children: React.ReactNode
}

export default function LoadingRoutesProvider({
	children,
}: LoadingRoutesProviderProps) {
	const [loading, setLoading] = React.useState(true)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
	}, [])
	return (
		<div>
			{/* <LoadingScreen isVisible={loading} /> */}
			{children}
		</div>
	)
}

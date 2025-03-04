'use client'
import React, { useEffect } from 'react'
import LoadingScreen from '../../(layout)/vytvorit/loading'

type LoadingRoutesProviderProps = {
	children: React.ReactNode
	show: boolean
}

export default function LoadingRoutesProvider({
	children,
	show,
}: LoadingRoutesProviderProps) {
	const [loading, setLoading] = React.useState(show)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
	}, [])
	return (
		<div>
			<LoadingScreen isVisible={loading} />
			{children}
		</div>
	)
}

import { Background } from '@/common'
import React from 'react'

type BackgroundProps = {
	children?: React.ReactNode
}

export default function Layout(props: BackgroundProps) {
	return (
		<>
			<Background />
			{props.children}
		</>
	)
}

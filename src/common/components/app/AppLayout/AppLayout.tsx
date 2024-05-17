import React from 'react'
import AppLayoutInner from './AppLayoutInner'

type AppLayoutProps = {
	children?: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
	return (
		<div>
			<AppLayoutInner>{children}</AppLayoutInner>
		</div>
	)
}

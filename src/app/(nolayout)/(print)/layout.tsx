'use client'
import { useEffect } from 'react'
import { LayoutProps } from '../../../common/types'
import PrintFootbar from './components/PrintFootbar'
import './print.css'

export default function layout(props: LayoutProps) {
	useEffect(() => {
		// window.print()
	}, [])
	return (
		<div id="print-layout">
			{props.children}

			<div
				style={{
					position: 'fixed',
					bottom: 0,
					left: 0,
					right: 0,
				}}
			>
				<PrintFootbar />
			</div>
		</div>
	)
}

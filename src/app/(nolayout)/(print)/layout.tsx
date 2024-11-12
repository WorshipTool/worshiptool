'use client'
import PrintClosePanel from '@/app/(nolayout)/(print)/components/PrintClosePanel'
import { Box } from '@/common/ui'
import { LayoutProps } from '../../../common/types'
import PrintFootbar from './components/PrintFootbar'
import './print.css'

export default function Layout(props: LayoutProps) {
	return (
		<div>
			<div id="print-layout">
				{props.children}

				<Box displayPrint={'none'}>
					<PrintClosePanel />
				</Box>

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
		</div>
	)
}

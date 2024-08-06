import { SmartPageInnerProvider } from '@/common/components/app/SmartPage/SmartPageInner'
import React from 'react'

export type SmartPageOptions = {
	transparentToolbar: boolean
}

export const SmartPage = (
	PageComponent: React.FC,
	pageOptions?: Partial<SmartPageOptions>
) => {
	return () => {
		return (
			<SmartPageInnerProvider pageOptions={pageOptions}>
				<PageComponent />
			</SmartPageInnerProvider>
		)
	}
}

// export const SmartPage = (PageComponent: React.FC) => {
// 	return () => {
// 		return <PageComponent />
// 	}
// }

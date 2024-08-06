'use client'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { SmartPageOptions } from '@/common/components/app/SmartPage/SmartPage'
import React, { useEffect, useMemo } from 'react'

export const SmartPageInnerProvider = ({
	children,
	pageOptions,
}: {
	children: React.ReactNode
	pageOptions?: Partial<SmartPageOptions>
}) => {
	const options: SmartPageOptions = useMemo(
		() => ({
			transparentToolbar: false,
			...pageOptions,
		}),
		[pageOptions]
	)

	const { setTransparent } = useToolbar()

	useEffect(() => {
		setTransparent(options.transparentToolbar)
	}, [options])

	return <>{children}</>
}

// export const SmartPage = (PageComponent: React.FC) => {
// 	return () => {
// 		return <PageComponent />
// 	}
// }

'use client'

import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useScrollHandler } from '@/common/providers/OnScrollComponent/useScrollHandler'
import { useEffect } from 'react'

export default function ToolbarChanger() {
	const toolbar = useToolbar()

	const { isTop } = useScrollHandler({
		topThreshold: 30,
	})
	useEffect(() => {
		toolbar.setTransparent(isTop)
	}, [isTop])

	return null
}

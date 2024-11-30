'use client'

import { useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'
import { useEffect, useState } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const useDownSize = (point: Breakpoint) => {
	const theme = useTheme()
	const result = useMediaQuery(theme.breakpoints.down(point))

	const [initial, setInitial] = useState(true)
	useEffect(() => {
		setInitial(false)
	}, [])

	return initial ? false : result
}

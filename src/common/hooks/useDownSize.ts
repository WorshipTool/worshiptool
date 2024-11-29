'use client'

import { useTheme } from '@/common/ui'
import { useMediaQuery } from '@/common/ui/mui'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const useDownSize = (point: Breakpoint) => {
	const theme = useTheme()
	return useMediaQuery(theme.breakpoints.down(point))
}
